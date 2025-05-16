<template>
  <aside class="sidebar-left border-r border-gray-200 fixed bg-white min-h-screen w-64 flex flex-col"
    :class="{ open: mobileMenuOpen }">
    <!-- Logo -->
    <div class="p-10">
      <router-link to="/admin" class="flex items-center">
        <img src="/logo.svg" alt="App Logo" class="w-40" />
      </router-link>
    </div>

    <!-- Menu List -->
    <div class="px-4 flex-1">
      <ul class="flex flex-col gap-3 text-sm list-none m-0">
        <template v-for="(menu, i) in menus" :key="i">
          <!-- Menu with Submenus -->
          <li v-if="menu.submenus" class="relative">
            <button @click="toggleSubmenu(menu.name)" :class="[
              'submenu flex justify-between items-center w-full text-left px-4 py-3 rounded-lg transition',
              openSubmenu === menu.name
                ? 'bg-[#EAE9FA] text-[#444151]'
                : 'hover:bg-[#EAE9FA] text-[#444151]',
            ]">
              <div class="flex items-center gap-3">
                <component :is="getIconComponent(menu.icon)" class="w-5 h-5 text-[#444151]" />
                <span>{{ menu.name }}</span>
              </div>
              <div>
                <ChevronUpIcon v-if="openSubmenu === menu.name" class="w-4 h-4" />
                <ChevronDownIcon v-else class="w-4 h-4" />
              </div>
            </button>

            <!-- Submenus -->
            <transition>
              <ul v-if="openSubmenu === menu.name" class="mt-2 ml-6 flex flex-col gap-2 list-none">
                <li v-for="(submenu, j) in menu.submenus" :key="j">
                  <router-link @click="$emit('close')" :to="submenu.url" :class="[
                    'block px-4 py-3 rounded-lg transition',
                    isActiveMenu(submenu)
                      ? 'bg-[#2F27CE] text-white'
                      : 'hover:bg-[#EAE9FA] text-[#444151]',
                  ]">
                    {{ submenu.name }}
                  </router-link>
                </li>
              </ul>
            </transition>
          </li>

          <!-- Single Menu Item -->
          <li v-else>
            <router-link :to="menu.url" @click="$emit('close')" :class="[
              'flex items-center gap-3 px-4 py-3 w-full rounded-lg text-left transition',
              isActiveMenu(menu)
                ? 'bg-[#2F27CE] text-white'
                : 'hover:bg-[#EAE9FA] text-[#444151]',
            ]">
              <component :is="getIconComponent(menu.icon)" :class="[
                'w-5 h-5',
                isActiveMenu(menu) ? 'text-white' : 'text-[#444151]',
              ]" />
              <span>{{ menu.name }}</span>
            </router-link>
          </li>
        </template>
      </ul>
    </div>

    <!-- Logout Button -->
    <div class="px-6 py-4">
      <router-link to="/login"
        class="flex items-center justify-center gap-2 border border-[#2F27CE] text-[#2F27CE] px-4 py-2 rounded-lg font-medium hover:bg-[#EAE9FA] transition">
        <component :is="getIconComponent('ArrowRightOnRectangle')" class="w-5 h-5" />
        Sign Out
      </router-link>
    </div>
  </aside>
</template>

<script>
import * as Icons from "@heroicons/vue/24/outline";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/vue/24/solid";
import { menuItems } from "../components/menu.js";

export default {
  props: ["mobileMenuOpen"],
  components: {
    ChevronDownIcon,
    ChevronUpIcon,
  },
  data() {
    return {
      menus: menuItems,
      openSubmenu: null,
      icons: Icons,
    };
  },
  mounted() {
    this.setOpenSubmenuBasedOnRoute();
  },
  watch: {
    $route() {
      this.setOpenSubmenuBasedOnRoute();
    },
  },
  methods: {
    toggleSubmenu(name) {
      this.openSubmenu = this.openSubmenu === name ? null : name;
    },
    setOpenSubmenuBasedOnRoute() {
      const currentPath = this.$route.path;
      this.menus.forEach((menu) => {
        if (menu.submenus) {
          menu.submenus.forEach((submenu) => {
            const isExactMatch = currentPath === submenu.url;
            const isActiveMatch =
              submenu.activeWhen &&
              submenu.activeWhen.some((path) => currentPath.startsWith(path));

            if (isExactMatch || isActiveMatch) {
              this.openSubmenu = menu.name;
            }
          });
        }
      });
    },
    getIconComponent(name) {
      return this.icons[name + "Icon"] || null;
    },
    isActiveMenu(menu) {
      const currentPath = this.$route.path;

      if (typeof menu === "string") {
        return currentPath === menu;
      }

      if (typeof menu === "object") {
        if (menu.activeWhen && Array.isArray(menu.activeWhen)) {
          return menu.activeWhen.some((path) => currentPath.startsWith(path));
        }

        if (menu.url) {
          return currentPath === menu.url;
        }
      }

      return false;
    },
  },
};
</script>

<style scoped>
.sidebar-left {
  transition: all 0.3s ease;
}
</style>
