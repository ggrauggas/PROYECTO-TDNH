<template>
  <div class="register-view">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <RegisterForm />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RegisterForm from '../components/RegisterForm.vue';

export default {
  name: 'RegisterView',
  components: { RegisterForm }
};
</script>