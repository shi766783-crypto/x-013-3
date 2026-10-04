<script setup>
import { computed, ref, watch } from 'vue'
import { X } from 'lucide-vue-next'
import { activityTypes, normalRanges, todayISO } from '../data'

const props = defineProps({ visible: Boolean, type: { type: String, default: 'health' }, pets: { type: Array, default: () => [] } })
const emit = defineEmits(['close', 'submit'])
const title = computed(() => ({ health: '记录健康指标', vaccine: '添加疫苗计划', medication: '添加用药计划', feeding: '设置喂食计划', activity: '记录一次活动' }[props.type]))
const form = ref({})
const defaults = {
  health: () => ({ petId: props.pets[0]?.id || '', type: 'weight', date: todayISO(), value: '' }),
  vaccine: () => ({ petId: props.pets[0]?.id || '', category: '疫苗', name: '', date: todayISO(), nextDate: '', hospital: '', notes: '' }),
  medication: () => ({ petId: props.pets[0]?.id || '', name: '', dose: '', frequency: '每日 1 次', startDate: todayISO(), endDate: '', notes: '' }),
  feeding: () => ({ petId: props.pets[0]?.id || '', food: '主粮', brand: '', times: 2, portion: '' }),
  activity: () => ({ petId: props.pets[0]?.id || '', date: todayISO(), duration: '', type: '散步', location: '', notes: '' }),
}
function reset() { form.value = defaults[props.type]() }
function submit() {
  const payload = { ...form.value }
  if (props.type === 'health') { payload.value = Number(payload.value); payload.type = payload.type }
  if (props.type === 'activity') payload.duration = Number(payload.duration)
  emit('submit', { collection: { health: 'healthRecords', vaccine: 'vaccines', medication: 'medications', feeding: 'feedings', activity: 'activities' }[props.type], payload })
  reset()
}
reset()
watch(() => props.type, reset)
watch(() => props.pets.length, reset)
</script>

<template>
  <div v-if="visible" class="modal-backdrop" @click.self="emit('close')">
    <section class="modal compact-modal">
      <header class="modal-header"><div><span class="eyebrow">添加记录</span><h2>{{ title }}</h2></div><button class="icon-btn" @click="emit('close')"><X :size="18" /></button></header>
      <form class="form-grid single-column" @submit.prevent="submit">
        <label>关联宠物<select v-model="form.petId"><option v-for="pet in pets" :key="pet.id" :value="pet.id">{{ pet.name }}</option></select></label>
        <template v-if="type === 'health'">
          <label>指标类型<select v-model="form.type"><option value="weight">体重（kg）</option><option value="temperature">体温（°C）</option><option value="heartRate">心率（bpm）</option></select></label>
          <label>测量日期<input v-model="form.date" type="date" required /></label><label>数值<input v-model="form.value" type="number" step="0.1" required placeholder="输入数值" /></label>
        </template>
        <template v-else-if="type === 'vaccine'">
          <label>记录类型<select v-model="form.category"><option>疫苗</option><option>驱虫</option></select></label><label>{{ form.category === '驱虫' ? '驱虫名称' : '疫苗名称' }}<input v-model="form.name" required :placeholder="form.category === '驱虫' ? '例如：体内驱虫' : '例如：猫三联'" /></label><div class="two-fields"><label>接种日期<input v-model="form.date" type="date" required /></label><label>下次接种<input v-model="form.nextDate" type="date" required /></label></div><label>医院名称<input v-model="form.hospital" placeholder="选填" /></label><label>备注<textarea v-model="form.notes" rows="2"></textarea></label>
        </template>
        <template v-else-if="type === 'medication'">
          <label>药品名称<input v-model="form.name" required placeholder="例如：益生菌" /></label><div class="two-fields"><label>剂量<input v-model="form.dose" placeholder="例如：1包" /></label><label>频率<select v-model="form.frequency"><option>每日 1 次</option><option>每日 2 次</option><option>每周 1 次</option></select></label></div><div class="two-fields"><label>开始日期<input v-model="form.startDate" type="date" required /></label><label>结束日期<input v-model="form.endDate" type="date" required /></label></div><label>备注<textarea v-model="form.notes" rows="2"></textarea></label>
        </template>
        <template v-else-if="type === 'feeding'">
          <label>食物类型<select v-model="form.food"><option>主粮</option><option>罐头</option><option>零食</option><option>营养品</option></select></label><label>品牌<input v-model="form.brand" required placeholder="例如：渴望六种鱼" /></label><div class="two-fields"><label>每日次数<input v-model="form.times" type="number" min="1" max="8" /></label><label>每次份量<input v-model="form.portion" placeholder="例如：35g" /></label></div>
        </template>
        <template v-else>
          <div class="two-fields"><label>活动日期<input v-model="form.date" type="date" required /></label><label>活动时长（分钟）<input v-model="form.duration" type="number" min="1" required /></label></div><label>活动类型<select v-model="form.type"><option v-for="item in activityTypes" :key="item">{{ item }}</option></select></label><label>地点<input v-model="form.location" placeholder="例如：江滨公园" /></label><label>备注<textarea v-model="form.notes" rows="2"></textarea></label>
        </template>
        <footer class="modal-actions"><button type="button" class="btn btn-quiet" @click="emit('close')">取消</button><button class="btn btn-primary" type="submit">保存记录</button></footer>
      </form>
    </section>
  </div>
</template>
