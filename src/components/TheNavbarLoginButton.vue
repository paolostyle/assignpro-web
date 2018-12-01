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
    }
}
</i18n>

<template>
  <div class="navbar-item" v-if="userSpinner">
    <b-icon icon="loading"></b-icon> {{ $t('loading') }}
  </div>
  <a class="navbar-item" v-else-if="!userSpinner && !user" @click="signIn()">
    <b-icon icon="login"></b-icon> {{ $t('login') }}
  </a>
  <a class="navbar-item" v-else-if="!userSpinner && user" @click="signOut()">
    <b-icon icon="logout"></b-icon> {{ $t('logout', { user: user.displayName }) }}
  </a>
</template>

<script lang="ts">
  import { UserCredential } from '@firebase/auth-types';
  import { SnackbarConfig } from 'buefy/types/components';
  import firebase from 'firebase/app';
  import 'firebase/auth';
  import { Component, Vue } from 'vue-property-decorator';
  import { Action, State } from 'vuex-class';

  @Component
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
