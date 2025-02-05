<template>
  <div class="flex items-center gap-4 border border-primary bg-transparent rounded-full w-full py-1 px-2 justify-between">
    <Button severity="contrast" icon="pi pi-chevron-left" rounded text @click="changePage(pagination.currentPage - 1)" :disabled="pagination.currentPage == 1" />
    <div class="text-color font-medium">
      <span class="block">Page {{ pagination.currentPage }} of {{ pagination.totalPages }}</span>
    </div>
    <Button severity="contrast" icon="pi pi-chevron-right" rounded text @click="changePage(pagination.currentPage + 1)" :disabled="pagination.currentPage == pagination.totalPages" />
  </div>
</template>
<script>
import Button from 'primevue/button';

export default {
  components: {
    Button
  },
  props: {
    pagination: {
      type: Object,
      required: true
    },
  },
  methods: {
    changePage(page) {
      if (page >= 1 && page <= this.pagination.totalPages) {
        this.$emit("paginate", {page: page});
      }
    }
  }
}
</script>