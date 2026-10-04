<script setup>
import { ref } from 'vue'
import { Camera, X } from 'lucide-vue-next'
import { speciesOptions } from '../data'

defineProps({ visible: Boolean })
const emit = defineEmits(['close', 'submit'])
const form = ref({ name: '', species: '狗', breed: '', gender: '公', birthDate: '', weight: '', color: '', neutered: false, microchip: '', photo: '', notes: '' })

function onFile(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => { form.value.photo = reader.result }
  reader.readAsDataURL(file)
}
function submit() {
  if (!form.value.name.trim()) return
  emit('submit', { ...form.value, weight: Number(form.value.weight) || 0 })
  form.value = { name: '', species: '狗', breed: '', gender: '公', birthDate: '', weight: '', color: '', neutered: false, microchip: '', photo: '', notes: '' }
}
</script>

<template>
  <div v-if="visible" class="modal-backdrop" @click.self="emit('close')">
    <section class="modal">
      <header class="modal-header"><div><span class="eyebrow">新档案</span><h2>添加一位新成员</h2></div><button class="icon-btn" @click="emit('close')"><X :size="18" /></button></header>
      <form class="form-grid" @submit.prevent="submit">
        <label class="photo-picker"><input type="file" accept="image/*" @change="onFile" /><img v-if="form.photo" :src="form.photo" alt="" /><Camera v-else :size="22" /><span>{{ form.photo ? '更换照片' : '上传照片' }}</span></label>
        <div class="form-fields">
          <label>宠物名称<input v-model="form.name" required placeholder="例如：Momo" /></label>
          <label>种类<select v-model="form.species"><option v-for="item in speciesOptions" :key="item">{{ item }}</option></select></label>
          <label>品种<input v-model="form.breed" placeholder="例如：英国短毛猫" /></label>
          <label>性别<select v-model="form.gender"><option>公</option><option>母</option></select></label>
          <label>出生日期<input v-model="form.birthDate" type="date" /></label>
          <label>当前体重（kg）<input v-model="form.weight" type="number" min="0" step="0.1" placeholder="0.0" /></label>
          <label>毛色<input v-model="form.color" placeholder="例如：奶油灰" /></label>
          <label class="check-label"><input v-model="form.neutered" type="checkbox" /> 已绝育</label>
          <label class="span-2">芯片号<input v-model="form.microchip" placeholder="选填" /></label>
          <label class="span-2">备注<textarea v-model="form.notes" rows="2" placeholder="过敏史、性格特点等"></textarea></label>
        </div>
        <footer class="modal-actions span-2"><button type="button" class="btn btn-quiet" @click="emit('close')">取消</button><button class="btn btn-primary" type="submit">创建档案</button></footer>
      </form>
    </section>
  </div>
</template>
