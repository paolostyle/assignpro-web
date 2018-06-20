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
    <div class="navbar-item"
         v-if="userSpinner">
        <b-icon icon="loading"></b-icon> {{ $t('loading') }}
    </div>
    <a class="navbar-item"
       v-else-if="!userSpinner && !user"
       @click="signIn()">
        <b-icon icon="login"></b-icon> {{ $t('login') }}
    </a>
    <a class="navbar-item"
       v-else-if="!userSpinner && user"
       @click="signOut()">
        <b-icon icon="logout"></b-icon> {{ $t('logout', {user: user.displayName})}}
    </a>
</template>

<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import * as firebase from 'firebase/app';
    import 'firebase/auth';
    import {Action, State} from 'vuex-class';
    import {SnackbarConfig} from 'buefy/types/components';

    @Component
    export default class TheNavbarLoginButton extends Vue {
        @State user: any;
        @State userSpinner: boolean;
        @Action logIn: (user) => void;
        @Action logOut: () => void;

        signIn() {
            let provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().languageCode = 'pl';
            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
                firebase.auth().signInWithPopup(provider)
                    .then(result => {
                        this.$snackbar.open({
                            message: this.$i18n.t('loginSuccess', {
                                name: result.user.displayName
                            }) as string,
                            type: 'is-success',
                        });
                    })
                    .catch(error => {
                        this.$snackbar.open({
                            message: this.$i18n.t('loginFailed', {
                                error: this.getSignInErrorMessage(error.code)
                            }),
                            type: 'is-danger',
                            indefinite: true,
                        } as SnackbarConfig);
                    });
            });
        }

        signOut() {
            firebase.auth().signOut().then(() => {
                this.logOut();
                this.$snackbar.open({
                    message: this.$i18n.tc('logoutSuccess'),
                    type: 'is-success',
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
                    return this.$i18n.t('errors.generic', {code});
            }
        }
    }
</script>
