<template>
    <nav class="navbar is-light has-shadow" role="navigation" aria-label="main navigation">
        <div class="container">
            <div class="navbar-brand">
                <a class="navbar-item has-text-black">
                    <h4 class="brand title is-4">Assign<span class="has-text-info">Pro</span></h4>
                </a>
            </div>
            <div class="navbar-menu">
                <div class="navbar-end">
                    <div v-if="userSpinner" class="navbar-item">
                        <span class="icon">
                            <i class="mdi mdi-loading mdi-24px"></i>
                        </span>
                        Sprawdzanie stanu zalogowania...
                    </div>
                    <a v-if="!userSpinner && !user" class="navbar-item" @click="signIn()">
                        <span class="icon">
                            <i class="mdi mdi-google mdi-24px"></i>
                        </span>
                        Zaloguj z Google
                    </a>
                    <a v-if="!userSpinner && user" class="navbar-item" @click="signOut()">
                        <span class="icon">
                            <i class="mdi mdi-logout mdi-24px"></i>
                        </span>
                        Wyloguj: {{user.displayName}}
                    </a>
                </div>
            </div>
        </div>
    </nav>
</template>

<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import * as firebase from 'firebase/app';
    import 'firebase/auth';
    import {Action, State} from 'vuex-class';
    import {SnackbarConfig} from 'buefy/types/components';

    @Component
    export default class ApNavbar extends Vue {
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
                            message: 'Pomyślnie zalogowano jako ' + result.user.displayName + '.',
                            type: 'is-success',
                        });
                    })
                    .catch(error => {
                        this.$snackbar.open({
                            message: `Logowanie nie powiodło się. ${this.handleSignInErrors(error.code)}`,
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
                    message: 'Pomyślnie wylogowano.',
                    type: 'is-success',
                });
            });
        }

        handleSignInErrors(code) {
            switch (code) {
                case 'auth/cancelled-popup-request':
                    return 'W trakcie logowania zostało otwarte kolejne okienko logowania.';
                case 'auth/popup-blocked':
                    return 'Okienko logowania zostało zablokowane przez przeglądarkę. ' +
                        'Upewnij się, że przeglądarka zezwala na otwieranie wyskakujących okienek.';
                case 'auth/popup-closed-by-user':
                    return 'Okienko logowania zostało zamknięte przed ukończeniem autoryzacji.';
                default:
                    return 'Kod błędu: ' + code + '. Przekaż proszę ten kod błędu autorowi aplikacji.';
            }
        }
    }
</script>

<style lang="scss" scoped>
    .navbar {
        z-index: 2;
    }

    i {
        margin-right: 1rem;
    }

    .navbar-item.loading {
        padding: 0 24px;
    }
</style>
