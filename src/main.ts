import { createApp } from 'vue'
import 'element3/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import {ElInput,ElSelect,ElOption,ElButton,ElDropdown,ElDropdownItem,ElDropdownMenu,ElMenu,ElMenuItem,ElSubmenu} from 'element3'
import store from './script/store/index'
const app = createApp(App)
app.use(router)
app.use(ElInput)
app.use(ElSelect)
app.use(ElOption)
app.use(ElButton)
app.use(ElDropdown)
app.use(ElDropdownItem)
app.use(ElDropdownMenu)
app.use(ElMenu)
app.use(ElMenuItem)
app.use(ElSubmenu)
app.use(store)
app.mount('#app')


