export const speciesOptions = ['狗', '猫', '兔', '鸟', '鱼', '其他']
export const activityTypes = ['散步', '奔跑', '玩耍']

export const normalRanges = {
  weight: { min: 3, max: 12, unit: 'kg', label: '体重' },
  temperature: { min: 37.5, max: 39.2, unit: '°C', label: '体温' },
  heartRate: { min: 60, max: 140, unit: 'bpm', label: '心率' },
}

export const achievementDefinitions = [
  { id: 'first-pet', icon: 'paw', title: '初次养宠', desc: '完成第一个宠物档案', condition: (s) => s.pets.length >= 1 },
  { id: 'health-keeper', icon: 'heart', title: '健康记录家', desc: '累计记录 5 次健康指标', condition: (s) => s.healthRecords.length >= 5 },
  { id: 'vaccine-on-time', icon: 'shield', title: '疫苗按时', desc: '添加一项完整疫苗计划', condition: (s) => s.vaccines.some((item) => item.nextDate) },
  { id: 'walk-master', icon: 'footprints', title: '遛狗达人', desc: '本周活动达到 180 分钟', condition: (s) => s.activities.filter((item) => isThisWeek(item.date)).reduce((sum, item) => sum + Number(item.duration || 0), 0) >= 180 },
  { id: 'pet-star', icon: 'star', title: '宠物之星', desc: '拥有 2 个及以上宠物', condition: (s) => s.pets.length >= 2 },
  { id: 'food-planner', icon: 'utensils', title: '营养规划师', desc: '为宠物设置喂食计划', condition: (s) => s.feedings.length >= 1 },
  { id: 'medication-pro', icon: 'pill', title: '用药管家', desc: '完成一项用药记录', condition: (s) => s.medications.length >= 1 },
  { id: 'trend-watcher', icon: 'chart', title: '趋势观察员', desc: '记录连续 3 天的体重', condition: (s) => new Set(s.healthRecords.filter((item) => item.type === 'weight').map((item) => item.date)).size >= 3 },
  { id: 'active-family', icon: 'sun', title: '活力家庭', desc: '累计完成 10 次活动', condition: (s) => s.activities.length >= 10 },
  { id: 'care-routine', icon: 'calendar', title: '规律生活', desc: '同时拥有喂食和用药计划', condition: (s) => s.feedings.length >= 1 && s.medications.length >= 1 },
  { id: 'wellness', icon: 'sparkles', title: '元气满满', desc: '完成 3 类健康记录', condition: (s) => new Set(s.healthRecords.map((item) => item.type)).size >= 3 },
  { id: 'family-record', icon: 'book', title: '家庭档案', desc: '填写宠物芯片或备注信息', condition: (s) => s.pets.some((item) => item.microchip || item.notes) },
]

export function uid(prefix = 'item') {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function todayISO() {
  const date = new Date()
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10)
}

export function daysFromToday(dateString) {
  const start = new Date(`${todayISO()}T00:00:00`)
  const target = new Date(`${dateString}T00:00:00`)
  return Math.round((target - start) / 86400000)
}

export function isThisWeek(dateString) {
  const date = new Date(`${dateString}T00:00:00`)
  const today = new Date(`${todayISO()}T00:00:00`)
  const day = today.getDay() || 7
  const monday = new Date(today)
  monday.setDate(today.getDate() - day + 1)
  monday.setHours(0, 0, 0, 0)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  return date >= monday && date <= sunday
}

export function calculateAge(birthDate) {
  if (!birthDate) return '年龄未知'
  const birth = new Date(`${birthDate}T00:00:00`)
  const now = new Date()
  let years = now.getFullYear() - birth.getFullYear()
  let months = now.getMonth() - birth.getMonth()
  if (now.getDate() < birth.getDate()) months -= 1
  if (months < 0) {
    years -= 1
    months += 12
  }
  if (years > 0) return `${years}岁${months ? ` ${months}个月` : ''}`
  return `${Math.max(months, 0)}个月`
}

export function formatDate(dateString, withYear = false) {
  if (!dateString) return '--'
  const date = new Date(`${dateString}T00:00:00`)
  return date.toLocaleDateString('zh-CN', withYear ? { year: 'numeric', month: 'long', day: 'numeric' } : { month: 'long', day: 'numeric' })
}

export function createDemoState() {
  return {
    pets: [
      { id: 'pet-momo', name: 'Momo', species: '猫', breed: '英国短毛猫', gender: '母', birthDate: '2021-05-18', weight: 4.8, color: '奶油灰', neutered: true, microchip: '9820004112', photo: '', notes: '对海鲜敏感' },
      { id: 'pet-nori', name: 'Nori', species: '狗', breed: '柴犬', gender: '公', birthDate: '2020-10-03', weight: 9.2, color: '赤色', neutered: true, microchip: '', photo: '', notes: '' },
    ],
    healthRecords: [
      { id: 'health-1', petId: 'pet-momo', type: 'weight', date: '2026-09-04', value: 4.6 },
      { id: 'health-2', petId: 'pet-momo', type: 'weight', date: '2026-09-10', value: 4.8 },
      { id: 'health-3', petId: 'pet-momo', type: 'temperature', date: '2026-09-12', value: 38.2 },
      { id: 'health-4', petId: 'pet-nori', type: 'weight', date: '2026-09-06', value: 9.1 },
      { id: 'health-5', petId: 'pet-nori', type: 'weight', date: '2026-09-14', value: 9.2 },
    ],
    vaccines: [
      { id: 'vaccine-1', petId: 'pet-momo', name: '猫三联', date: '2026-01-12', nextDate: '2026-09-22', hospital: '和煦动物医院', notes: '年度加强针' },
      { id: 'vaccine-2', petId: 'pet-nori', name: '狂犬疫苗', date: '2025-10-08', nextDate: '2026-10-08', hospital: '森屿宠物诊所', notes: '' },
    ],
    medications: [
      { id: 'med-1', petId: 'pet-momo', name: '益生菌', dose: '1包', frequency: '每日 1 次', startDate: '2026-09-15', endDate: '2026-09-21', notes: '随餐喂食' },
    ],
    feedings: [
      { id: 'feed-1', petId: 'pet-momo', food: '主粮', brand: '渴望六种鱼', times: 2, portion: '35g' },
      { id: 'feed-2', petId: 'pet-nori', food: '主粮', brand: '爱肯拿鸭肉梨', times: 2, portion: '80g' },
    ],
    activities: [
      { id: 'activity-1', petId: 'pet-nori', date: '2026-09-15', duration: 35, type: '散步', location: '江滨公园', notes: '' },
      { id: 'activity-2', petId: 'pet-nori', date: '2026-09-13', duration: 50, type: '奔跑', location: '社区草坪', notes: '' },
      { id: 'activity-3', petId: 'pet-momo', date: '2026-09-14', duration: 20, type: '玩耍', location: '家中', notes: '' },
    ],
  }
}
