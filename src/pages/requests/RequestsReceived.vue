<template>
  <div>
    <section>
      <base-card>
        <header>
          <h2>Requests Received</h2>
        </header>
        <base-spinner v-if="isLoading"></base-spinner>
        <ul v-else-if="hasRequests && !isLoading">
          <request-item
            v-for="request in receivedRequests"
            :key="request.id"
            :email="request.userEmail"
            :message="request.message"
          ></request-item>
        </ul>
        <h3 v-else>You havent't received any requests yet!</h3>
      </base-card>
    </section>
    <base-dialog :show="!!error" title="An error occured!" @close="handleCLose">
      <p>{{ error }}</p>
    </base-dialog>
  </div>
</template>

<script>
import RequestItem from '../../components/layout/requests/RequstItem.vue';

export default {
  data() {
    return {
      isLoading: false,
      error: null,
    };
  },
  components: { RequestItem },
  created() {
    this.loadRequests();
  },
  computed: {
    receivedRequests() {
      return this.$store.getters['requests/requests'];
    },
    hasRequests() {
      return this.$store.getters['requests/hasRequests'];
    },
  },
  methods: {
    async loadRequests() {
      this.loading = true;

      try {
        await this.$store.dispatch('requests/fetchRequests');
      } catch (error) {
        this.error = error.message || 'Something failed!';
      }

      this.loading = false;
    },
    handleCLose() {
      this.error = null;
    },
  },
};
</script>

<style scoped>
header {
  text-align: center;
}

ul {
  list-style: none;
  margin: 2rem auto;
  padding: 0;
  max-width: 30rem;
}

h3 {
  text-align: center;
}
</style>
