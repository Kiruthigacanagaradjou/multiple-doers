<template>
  <button @click="$router.push('/')" class="back-btn" style="cursor: pointer; display: flex; justify-content: flex-end;" title="Back">
      <i class="fa fa-arrow-left"></i>
  </button>
  <div class="container">
    <h2 class="title">Transaction Doer</h2>

    <!-- Status Counts -->
    <div class="status-counts">
      <div class="status-box pending">
        <span class="count">{{ statusCounts.Pending }}</span>
        <span class="label">Pending</span>
      </div>
      <div class="status-box completed">
        <span class="count">{{ statusCounts.Completed }}</span>
        <span class="label">Completed</span>
      </div>
      <div class="status-box cancelled">
        <span class="count">{{ statusCounts.Cancelled }}</span>
        <span class="label">Cancelled</span>
      </div>
    </div>

    <div class="top-bar">
      <div class="filter-container">
        <label class="filter-label">Filter</label>
        <select v-model="statusFilter" @change="handleFilterChange" class="filter-select">
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div class="button-row">
        <button @click="openModal(false)" class="add-btn" title="Add New">
          <i class="fa fa-plus"></i>
        </button>
        <button @click="exportData" class="add-btn" title="Export JSON">
          <i class="fa fa-download"></i>
        </button>
      </div>
    </div>

    <!-- DataTable -->
    <div class="table-container" :class="{ blurred: showModal }">
      <EasyDataTable
        :headers="headers"
        :items="transactions"
        :search-value="search"
        :rows-per-page="limit"
        :server-items-length="totalTransactions"
        :server-options="{ page, rowsPerPage: limit }"
        @update:server-options="handlePageChange"
      >
        <template #item-actions="item">
          <button @click="openModal(true, item)" class="edit-btn" style="cursor: pointer" title="Edit">
            <i class="fa fa-edit"></i>
          </button>
          <button @click="deleteTransaction(item._id)" class="delete-btn" style="margin-left: 10px; cursor: pointer" title="Delete">
            <i class="fa fa-trash"></i>
          </button>
        </template>
        <!-- <template #expand="item">
            <div class="expanded-content">
                <pre>{{ JSON.stringify(item, null, 2) }}</pre>
            </div>
        </template> -->
        <template #expand="item">
          <div class="expanded-content">
            <!-- <pre>{{ JSON.stringify(item, null, 2) }}</pre> -->
            <vue-json-pretty :data="item" :deep="2"></vue-json-pretty>
          </div>
        </template>
      </EasyDataTable>
    </div>

    <!-- Create and Edit modal -->
    <div v-if="showModal" class="modal-overlay"> 
      <div class="modal-content">
        <h3 class="modal-title">
          {{ isEditing ? "Edit Transaction" : "Add Transaction" }}
        </h3>

        <div class="form-group">
          <label for="name">Name:</label>
          <input id="name" v-model="transaction.name" type="text" placeholder="Enter Name" required />
        </div>
        <div class="form-group">
          <label for="token">Token Number:</label>
          <input id="token" v-model="transaction.tokenNumber" type="number" placeholder="Enter Token Number" required />
        </div>

        <div class="form-group">
          <label for="status">Status:</label>
          <select id="status" v-model="transaction.status">
            <option>Pending</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>

        <div class="form-group">
          <label>Data:</label>
          <div class="checkbox-group">
            <label>
              <input type="checkbox" v-model="transaction.data.Invoice" />
              Invoice
            </label>
            <label>
              <input type="checkbox" v-model="transaction.data.Receipt" />
              Receipt
            </label>
            <label>
              <input type="checkbox" v-model="transaction.data.Form" />
              Form
            </label>
          </div>
        </div>

        <div class="modal-actions">
          <button
            @click="isEditing ? updateTransaction() : addTransaction()"
            class="submit-btn"
          >
            {{ isEditing ? "Update" : "Submit" }}
          </button>
          <button @click="showModal = false" class="close-btn">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../api/axios";
import EasyDataTable from "vue3-easy-data-table";
import VueJsonPretty from "vue-json-pretty";
import "vue3-easy-data-table/dist/style.css";
import "../assets/css/transaction-doer.css";
import "@fortawesome/fontawesome-free/css/all.css";

export default {
  components: { EasyDataTable, VueJsonPretty },
  data() {
    return {
      showModal: false,
      isEditing: false,
      transactions: [],
      transaction: {
        name: "",
        tokenNumber: "",
        status: "Pending",
        data: { Invoice: false, Receipt: false, Form: false },
      },
      page: 1,
      limit: 10,
      totalTransactions: 0,
      search: "",
      statusFilter: "",
      statusCounts: { Pending: 0, Completed: 0, Cancelled: 0 }, // Status Counts
      headers: [
        { text: "S.No", value: "serialNumber" },
        { text: "Name", value: "name" },
        { text: "Token", value: "tokenNumber" },
        { text: "Status", value: "status" },
        { text: "Actions", value: "actions" },
      ],
    };
  },
  watch: {
    statusFilter() {
      this.page = 1;
      this.fetchTransactions();
    },
  },
  methods: {
    async fetchTransactions() {
      try {
        const response = await api.get(`/transactions`, {
          params: { page: this.page, limit: this.limit, status: this.statusFilter },
        });
        this.transactions = response.data.transactions.map((transaction, index) => ({
          ...transaction,
          serialNumber: (this.page - 1) * this.limit + index + 1, // S.No Fix
        }));
        this.totalTransactions = response.data.total;
        this.statusCounts = response.data.statusCounts;
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    },
    async addTransaction() {
      try {
        await api.post("/transactions", this.transaction);
        this.showModal = false;
        this.fetchTransactions();
      } catch (error) {
        console.error("Error adding transaction:", error);
      }
    },
    async deleteTransaction(id) {
      if (!confirm("Are you sure you want to delete this transaction?")) return;
      try {
        await api.delete(`/transactions/${id}`);
        this.fetchTransactions();
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    },
    openModal(edit, item = null) {
      this.isEditing = edit;
      this.showModal = true;
      if (edit && item) {
        this.transaction = JSON.parse(JSON.stringify(item));
      } else {
        this.transaction = {
          name: "",
          tokenNumber: "",
          status: "Pending",
          data: { Invoice: false, Receipt: false, Form: false },
        };
      }
    },
    async updateTransaction() {
      try {
        await api.put(`/transactions/${this.transaction._id}`, this.transaction);
        this.isEditing = false;
        this.showModal = false;
        this.fetchTransactions();
      } catch (error) {
        console.error("Error updating transaction:", error);
      }
    },
    handlePageChange({ page, rowsPerPage }) {
      this.page = page;
      this.limit = rowsPerPage;
      this.fetchTransactions();
    },
    handleFilterChange() {
      this.page = 1;
      this.fetchTransactions();
    },
    exportData() {
      const dataStr = JSON.stringify(this.transactions, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "transactions.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
  },
  mounted() {
    this.fetchTransactions();
  },
};
</script>
