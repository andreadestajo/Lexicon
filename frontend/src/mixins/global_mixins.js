import { postWalletDetailsOptions } from "../references/url";
export default
    {
        data: () =>
            ({
            }),
        computed:
        {
            $token() {
                return this.$store.state.user.token;
            },
            $user_info() {
                return this.$store.state.user.user_info;
            },
            $wallet()
            {
                return this.$store.state.user.wallet;
            },
        },
        created() {
        },
        mounted() {
        },
        methods:
        {
            async $_logout() {
                this.$store.commit('user/updateUser', null);
                sessionStorage.removeItem("auth");
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("send_attempt");
                sessionStorage.removeItem("currency_details");
            },

            async $_post(url, data) {
                let res = null;

                await this.$axios.post(url, data, {
                    headers: {
                        'authorization': this.$token,
                    }
                }).then((r) => {
                    res = r;
                }).catch((e) => {
                    this.$q.notify({
                        message: '<div style="color: red; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>' + e.response.data.message + '</div>',
                        position: 'top',
                        color: 'white',
                        html: true,
                    });

                    res = e
                    
                    if(res.response.data.message == 'Failed to authenticate token.')
                    {
                        window.location.href = "https://enabler.link/lexicon/#/login";
                    }
                });

                return res;
            },

            async $_get(url, data) {
                let res = null;

                await this.$axios.get(url).then((r) => {
                    res = r;
                }).catch((e) => {

                    this.$q.notify({
                        message: '<div style="color: red; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>' + e.response.data.message + '</div>',
                        position: 'top',
                        color: 'white',
                        html: true,
                    });

                    res = e
                });
                return res;
            },
            async $_put(url, data = {}) {
                data.user_info = this.$user_info;
                let res = null;

                await this.$axios.put(url, data, {
                    headers: {
                        'authorization': this.$token,
                    }
                }).then(async (r) => {
                    res = await r;
                }).catch(async (e) => {

                    this.$q.notify({
                        message: '<div style="color: red; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>' + e.response.data.message + '</div>',
                        position: 'top',
                        color: 'white',
                        html: true,
                    });

                    res = e
                });
                return res;
            },
            async $_delete(url, data = {}) {
                data.user_info = this.$user_info;
                let res = null;

                await this.$axios.delete(url, data, {
                    headers: {
                        'authorization': this.$token,
                    }
                }).then((r) => {
                    res = r;
                }).catch((e) => {

                    this.$q.notify({
                        message: '<div style="color: red; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>' + e.response.data.message + '</div>',
                        position: 'top',
                        color: 'white',
                        html: true,
                    });
                    
                    res = e
                });
                return res;
            },
            $_formatDate(date) {
                alert("date" + date);
            },

            async $_update_step(adjustment) {
                this.$emit('update_step', adjustment);
            },
            async $_locateUser() {
                let x = await this.$_get('https://ipapi.co/json/')
                return x
            },
            async $_getUserCountryInfo(country) {
                return this.$_get(`https://restcountries.eu/rest/v2/name/${country}`);
            },
        },

        filters: {
            toUpperCase(val) {
                return val.toUpperCase();
            },
            toLowerCase(val) {
                return val.toLowerCase();
            },
            toCapitalize(val) {
                return val
                    .toLowerCase()
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            }
        },

        // async $_test() {
        //     await this.$_post(postWalletDetailsOptions)
        // },

    }
