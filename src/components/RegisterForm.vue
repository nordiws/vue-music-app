<template>
  <vee-form
    :validation-schema="schema"
    @submit="register"
    :initial-values="userData"
  >
    <div
      class="text-white text-center font-bold p-5 mb-4"
      v-if="registration_show_alert"
      :class="registration_alert_variant"
    >
      {{ registration_alert_message }}
    </div>
    <!-- Name -->
    <div class="mb-3">
      <span
        class="inline-block mb-2"
      >
        Name</span>
      <vee-field
        name="name"
        type="text"
        class="
            block
            w-full
            py-1.5
            px-3
            text-gray-800
            border border-gray-300
            transition
            duration-500
            focus:outline-none focus:border-black
            rounded
          "
        placeholder="Enter Name"
      />
      <ErrorMessage
        class="text-red-600"
        name="name"
      />
    </div>
    <!-- Email -->
    <div class="mb-3">
      <span
        class="inline-block mb-2"
        for="email"
      >Email</span>
      <vee-field
        name="email"
        type="email"
        class="
            block
            w-full
            py-1.5
            px-3
            text-gray-800
            border border-gray-300
            transition
            duration-500
            focus:outline-none focus:border-black
            rounded
          "
        placeholder="Enter Email"
      />
      <ErrorMessage
        class="text-red-600"
        name="email"
      />
    </div>
    <!-- Age -->
    <div class="mb-3">
      <span
        class="inline-block mb-2"
        for="age"
      >Age
      </span>
      <vee-field
        name="age"
        type="number"
        class="
            block
            w-full
            py-1.5
            px-3
            text-gray-800
            border border-gray-300
            transition
            duration-500
            focus:outline-none focus:border-black
            rounded
          "
      />
      <ErrorMessage
        class="text-red-600"
        name="age"
      />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label
        class="inline-block mb-2"
        for="password"
      >
        Password
        <vee-field
          name="password"
          :bails="false"
          v-slot="{field, errors}"
        >
          <input
            name="password"
            type="password"
            class="
              block
              w-full
              py-1.5
              px-3
              text-gray-800
              border border-gray-300
              transition
              duration-500
              focus:outline-none focus:border-black
              rounded
            "
            placeholder="Password"
            v-bind="field"
          >
          <div
            class="text-red-600"
            v-for="error in errors"
            :key="error"
          >
            {{ error }}
          </div>
        </vee-field>
      </label>
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <span class="inline-block mb-2">Confirm Password</span>
      <vee-field
        name="confirm_password"
        type="password"
        class="
            block
            w-full
            py-1.5
            px-3
            text-gray-800
            border border-gray-300
            transition
            duration-500
            focus:outline-none focus:border-black
            rounded
          "
        placeholder="Confirm Password"
      />
      <ErrorMessage
        class="text-red-600"
        name="confirm_password"
      />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <span class="inline-block mb-2">Country</span>
      <vee-field
        as="select"
        name="country"
        class="
            block
            w-full
            py-1.5
            px-3
            text-gray-800
            border border-gray-300
            transition
            duration-500
            focus:outline-none focus:border-black
            rounded
          "
      >
        <option value="Brazil">
          Brazil
        </option>
        <option value="USA">
          USA
        </option>
        <option value="Mexico">
          Mexico
        </option>
        <option value="Germany">
          Germany
        </option>
        <option value="Ukraine">
          Ukraine
        </option>
      </vee-field>
      <ErrorMessage
        class="text-red-600"
        name="country"
      />
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <span class="inline-block">Accept terms of service</span>
      <vee-field
        name="tos"
        value="1"
        type="checkbox"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
        id="terms"
      />
      <ErrorMessage
        class="text-red-600 block"
        name="tos"
      />
    </div>
    <!-- Submit Button -->
    <button
      type="submit"
      class="
        block
        w-full
        bg-purple-600
        text-white
        py-1.5
        px-3
        rounded
        transition
        hover:bg-purple-700
      "
      :disabled="registration_in_submission"
    >
      Submit
    </button>
  </vee-form>
</template>

<script>
export default {
  name: 'RegistrationForm',
  data() {
    return {
      schema: {
        name: 'required|min:3|max:100|alpha_spaces',
        email: 'required|min:3|max:100|email',
        age: 'required|min_value:18|max_value:120',
        password: 'required|min:6|max:100',
        confirm_password: 'passwords_mismatch:@password',
        country: 'required|country_excluded:Ukraine',
        tos: 'tos',
      },
      userData: {
        country: 'Brazil',
      },
      registration_in_submission: false,
      registration_show_alert: false,
      registration_alert_variant: 'bg-blue-500',
      registration_alert_message: 'Please wait! Your account is being created.',
    };
  },
  methods: {
    async register(value) {
      this.registration_show_alert = true;
      this.registration_in_submission = true;
      this.registration_alert_variant = 'bg-blue-500';
      this.registration_alert_message = 'Please wait! Your account is being created.';
      try {
        await this.$store.dispatch('register', value);
      } catch (error) {
        console.log(error);
        this.registration_in_submission = false;
        this.registration_alert_variant = 'bg-red-500';
        this.registration_alert_message = 'An unexpected error ocurred. Please try again later.';
        return;
      }
      this.registration_alert_variant = 'bg-green-500';
      this.registration_alert_message = 'Success! Your account has been created';
      window.location.reload();
    },
  },
};
</script>
