<i18n>
{
  "pl": {
    "login": "Zaloguj z Google",
    "logout": "Wyloguj: {user}",
    "loading": "Sprawdzanie stanu zalogowania...",
    "loginSuccess": "Pomyślnie zalogowano jako {name}.",
    "loginFailed": "Logowanie nie powiodło się. {error}",
    "logoutSuccess": "Pomyślnie wylogowano.",
    "errors": {
      "cancelledPopup": "W trakcie logowania zostało otwarte kolejne okienko logowania.",
      "popupBlocked": {
          "msg": "@:errors.popupBlocked.p1 @:errors.popupBlocked.p2",
          "p1": "Okienko logowania zostało zablokowane przez przeglądarkę.",
          "p2": "Upewnij się, że przeglądarka zezwala na otwieranie wyskakujących okienek."
      },
      "popupClosed": "Okienko logowania zostało zamknięte przed ukończeniem autoryzacji.",
      "generic": "Kod błędu: {code}. Przekaż ten kod błędu autorowi aplikacji."
    }
  },
  "en": {
    "login": "Log in with Google",
    "logout": "Log out: {user}",
    "loading": "Checking logging in status...",
    "loginSuccess": "Successfully logged in as {name}.",
    "loginFailed": "Login failed. {error}",
    "logoutSuccess": "Logged out successful.",
    "errors": {
      "cancelledPopup": "Another popup has been opened while logging in.",
      "popupBlocked": {
      "msg": "@:errors.popupBlocked.p1 @:errors.popupBlocked.p2",
      "p1": "Log in pop up has been blocked by your browser.",
      "p2": "Make sure your browser allows opening popups."
    },
    "popupClosed": "Login popup has been closed before finishing authorization",
    "generic": "Error code: {code}. Send this error code to app developer."
    }
  }
}
</i18n>

<template>
  <b-navbar-item icon="loading" block v-if="userSpinner">
    {{ $t('loading') }}
  </b-navbar-item>
  <b-navbar-item @click="signIn()" icon="login" v-else-if="!userSpinner && !user">
    {{ $t('login') }}
  </b-navbar-item>
  <b-navbar-item @click="signOut()" icon="logout" v-else-if="!userSpinner && user">
    {{ $t('logout', { user: user.displayName }) }}
  </b-navbar-item>
</template>

<script lang="ts">
import { UserCredential } from '@firebase/auth-types';
import { SnackbarConfig } from 'buefy/types/components';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Component, Vue } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import BNavbarItem from './bulma/BNavbarItem.vue';

@Component({
  components: { BNavbarItem }
})
export default class TheNavbarLoginButton extends Vue {
  userSpinner: boolean = true;
  @State user: any;
  @Action handleSuccessfulLogin: (user) => void;
  @Action logIn: () => Promise<UserCredential>;
  @Action logOut: () => Promise<void>;

  beforeCreate() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.handleSuccessfulLogin(user);
      }
      this.userSpinner = false;
    });
  }

  signIn() {
    this.userSpinner = true;
    this.logIn()
      .then(({ user }) => {
        if (user) {
          this.$snackbar.open({
            message: this.$i18n.t('loginSuccess', {
              name: user.displayName
            }) as string,
            type: 'is-success'
          });
        }
      })
      .catch(error => {
        this.$snackbar.open({
          message: this.$i18n.t('loginFailed', {
            error: this.getSignInErrorMessage(error.code)
          }),
          type: 'is-danger',
          indefinite: true
        } as SnackbarConfig);
      })
      .finally(() => (this.userSpinner = false));
  }

  signOut() {
    this.userSpinner = true;
    this.logOut().then(() => {
      this.$snackbar.open({
        message: this.$i18n.tc('logoutSuccess'),
        type: 'is-success'
      });
    });
  }

  private getSignInErrorMessage(code) {
    switch (code) {
      case 'auth/cancelled-popup-request':
        return this.$i18n.t('errors.cancelledPopup');
      case 'auth/popup-blocked':
        return this.$i18n.t('errors.popupBlocked.msg');
      case 'auth/popup-closed-by-user':
        return this.$i18n.t('errors.popupClosed');
      default:
        return this.$i18n.t('errors.generic', { code });
    }
  }
}
</script>
