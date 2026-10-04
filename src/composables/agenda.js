import { Pill, ShieldCheck, Utensils } from 'lucide-vue-next'
import { daysFromToday, shiftDate, todayISO } from '../data'

export const WEEK_LABELS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

// 生成某一天的日程：喂食/用药按真实时间展开并排序，同一只宠物的喂食时间冲突会被标记
export function buildAgenda(date, { feedings = [], medications = [], vaccines = [], petName = () => '未命名宠物', today = todayISO() }) {
  const isToday = date === today
  // 喂食：按每个计划中设置的真实时间逐条展开
  const feedingEntries = feedings.flatMap((plan) =>
    (plan.mealTimes || []).map((time, index) => ({
      id: `${plan.id}-${index}`,
      kind: 'feeding',
      icon: Utensils,
      title: `${petName(plan.petId)} · ${plan.food}`,
      detail: `${plan.portion || '按计划'} · 第 ${index + 1} 餐`,
      time,
      sortKey: `0-${time}`,
    })),
  )
  // 同一天同一只宠物出现相同喂食时间时（含跨喂食计划），全部标记冲突
  const planById = new Map(feedings.map((plan) => [plan.id, plan]))
  const slotCountMap = feedings.reduce((map, plan) => {
    ;(plan.mealTimes || []).forEach((time) => {
      const slot = `${plan.petId}@${time}`
      map.set(slot, (map.get(slot) || 0) + 1)
    })
    return map
  }, new Map())
  feedingEntries.forEach((item) => {
    const planId = item.id.slice(0, item.id.lastIndexOf('-'))
    const plan = planById.get(planId)
    item.conflict = plan ? slotCountMap.get(`${plan.petId}@${item.time}`) > 1 : false
  })
  // 用药：处于开始/结束日期之间（含首尾）时，每天按设定时间出现
  const medicationItems = medications
    .filter((item) => item.startDate <= date && item.endDate >= date)
    .flatMap((item) =>
      (item.times || []).map((time, index) => ({
        id: `${item.id}-${index}`,
        kind: 'medication',
        icon: Pill,
        title: `${petName(item.petId)} · ${item.name}`,
        detail: `${item.dose} · ${item.frequency}${item.times.length > 1 ? ` · 第 ${index + 1} 次` : ''}`,
        time,
        sortKey: `0-${time}`,
      })),
    )
  // 疫苗：在临期当天出现；逾期项在今天置顶提示
  const vaccineItems = vaccines
    .map((item) => ({ ...item, days: item.days ?? daysFromToday(item.nextDate) }))
    .filter((item) => (isToday && item.days < 0) || item.nextDate === date)
    .map((item) => ({
      id: item.id,
      kind: 'vaccine',
      icon: ShieldCheck,
      title: `${petName(item.petId)} · ${item.name}`,
      detail: item.days < 0 ? '已逾期，请尽快安排' : item.days === 0 ? '今天需要接种' : `${item.days} 天后到期`,
      time: '提醒',
      sortKey: '1-99:99',
    }))
  return [...feedingEntries, ...medicationItems, ...vaccineItems].sort((a, b) => a.sortKey.localeCompare(b.sortKey) || a.id.localeCompare(b.id))
}

// 未来 7 天（含今天）的日程分组
export function buildScheduleDays(collections, { days = 7, today = todayISO() } = {}) {
  return Array.from({ length: days }, (_, index) => {
    const date = shiftDate(today, index)
    return {
      date,
      label: index === 0 ? '今天' : WEEK_LABELS[new Date(`${date}T00:00:00`).getDay()],
      items: buildAgenda(date, { ...collections, today }),
    }
  })
}
