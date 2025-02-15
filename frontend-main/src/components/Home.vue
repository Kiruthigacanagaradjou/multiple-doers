<template>
  <div class="home">
    <div class="box" @click="$router.push('/transaction-doer')">Transaction Doer</div>
    <div class="box" @click="$router.push('/upload-doer')">Upload Doer</div>
    <div class="box" @click="$router.push('/material-doer')">Material Doer</div>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
};
</script>

<style scoped>
.home {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 50px;
}
.box {
  width: 220px;
  height: 120px;
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: bold;
  border-radius: 12px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.box:hover {
  background: linear-gradient(135deg, #0056b3, #003f7f);
  transform: translateY(-5px);
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.15);
}
</style>