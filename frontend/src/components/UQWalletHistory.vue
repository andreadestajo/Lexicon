<template>
  <div class="q-pb-xl" id="transact-history">
    <div>
      <div class="text-center icon bg-default color-default" style="border-radius: 20px 20px 0 0">
        <!-- <i class="fa fa-wallet q-mr-sm"></i> -->
        <span id="balance">
          <div id="header-h6">
            <b>
              <p
                id="font-sizing"
                class="deposit-css-transfer q-py-md font-bebas"
              >{{ tab }} Transaction History</p>
            </b>
          </div>
        </span>
      </div>
      <!-- Content -->
      <div class="q-px-xl">
        <!-- Currency Dropdown -->
        <div>
          <q-select
            class="full-width font-monseratt"
            outlined
            v-model="tab"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            behavior="menu"
            label="Currency"
            :rules="[val => !!val || '* Field is required']"
            :options="currency_list"
            @input="getTransactionHistory"
            style="width: 250px"
          ></q-select>
        </div>
        <div v-if="transaction_list.length == 0" class="text-center">
          <p class="font-raleway">No existing transaction</p>
        </div>
        <div
          class="column"
          id="container-history"
          v-for="transaction in transaction_list"
          :key="transaction._id"
          style="border-radius: 10px; margin-bottom: 13px; border-left: 4px solid #2f4c73; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.20);"
        >
          <div :class="transaction_list.indexOf(transaction) % 2 != 0 && ''">
            <div
              class="row justify-around q-px-lg q-pt-md"
              id="container-description-history"
              v-if="is_shown_history"
            >
              <div class="col-12 col-sm-8">
                <div
                  class="col-4"
                  v-if="transaction.transaction_method == 'minus'"
                  style="font-weight: bolder;"
                >
                  <i class="fas fa-share" style="color: red"></i>
                  <span class="q-ml-sm">
                    {{
                    transaction.description
                    }}
                  </span>
                </div>
                <div
                  class="col-4"
                  v-if="transaction.transaction_method == 'plus'"
                  style="font-weight: bolder;"
                >
                  <i class="fas fa-share fa-rotate-180" style="color: green"></i>
                  <span class="font-raleway q-ml-sm">
                    {{
                    transaction.description
                    }}
                  </span>
                </div>

                <q-separator id="mobile-transact" />

                <br />
                <div class="col" style="font-size: 11px">
                  Previous Balance:
                  <span class="q-ml-sm" style="font-size: 16px">
                    <b>
                      {{
                      (
                      transaction.balance_before /
                      10 ** transaction.decimal_places
                      ).toLocaleString("en-US", {
                      minimumFractionDigits: transaction.decimal_places
                      })
                      }}
                      {{ tab }}
                    </b>
                  </span>
                </div>
                <div class="col" style="font-size: 11px">
                  Running Balance:
                  <span class="q-ml-sm" style="font-size: 16px">
                    <b>
                      {{
                      (
                      transaction.balance_after /
                      10 ** transaction.decimal_places
                      ).toLocaleString("en-US", {
                      minimumFractionDigits: transaction.decimal_places
                      })
                      }}
                      {{ tab }}
                    </b>
                  </span>
                </div>
                <div
                  v-if="transaction.transaction_type == 'send internal'"
                  class="col"
                  style="font-size: 11px"
                >
                  Transaction Type:
                  <span class="q-ml-sm" style="font-size: 16px">
                    <b id="desktop-transact">Sent to another Lexicon account</b>

                    <div id="mobile-transact">
                      <b>Sent to another Lexicon account</b>
                      <br />
                      <br />
                      <q-separator />
                    </div>
                  </span>
                </div>
                <div
                  v-if="transaction.transaction_type == 'send external'"
                  class="col"
                  style="font-size: 11px"
                >
                  Transaction Type:
                  <span class="q-ml-sm" style="font-size: 16px">
                    <b id="desktop-transact">Wire Transfer</b>

                    <div id="mobile-transact">
                      <b>Wire Transfer</b>
                      <br />
                      <br />
                      <q-separator />
                    </div>
                  </span>
                </div>

                <div
                  v-if="transaction.transaction_type == 'convert'"
                  class="col"
                  style="font-size: 11px"
                >
                  Transaction Type:
                  <span class="q-ml-sm" style="font-size: 16px">
                    <b id="desktop-transact">Funds Converted</b>

                    <div id="mobile-transact">
                      <b>Funds Converted</b>
                      <br />
                      <br />
                      <q-separator />
                    </div>
                  </span>
                </div>
                <div
                  v-if="transaction.transaction_type == 'returned balance'"
                  class="col"
                  style="font-size: 11px"
                >
                  Transaction Type:
                  <span class="q-ml-sm" style="font-size: 16px">
                    <b id="desktop-transact">Returned Transfer</b>

                    <div id="mobile-transact">
                      <b>Returned Transfer</b>
                      <br />
                      <br />
                      <q-separator />
                    </div>
                  </span>
                </div>
              </div>
              <div class="col-12 col-sm-4" id="second-column">
                <div>
                  <div
                    class="col"
                    v-if="transaction.transaction_method == 'minus'"
                    style="color: red; font-weight:bold; letter-spacing: 1px; font-size: 18px"
                  >
                    <b>
                      -
                      {{
                      (
                      transaction.amount /
                      10 ** transaction.decimal_places
                      ).toLocaleString("en-US", {
                      minimumFractionDigits: transaction.decimal_places
                      }) +
                      " " +
                      transaction.currency_abbreviation
                      }}
                    </b>
                  </div>
                  <div
                    class="col"
                    v-if="transaction.transaction_method == 'plus'"
                    style="color: green; font-weight:bold; letter-spacing: 1px; font-size: 18px"
                  >
                    <b>
                      +
                      {{
                      (
                      transaction.amount /
                      10 ** transaction.decimal_places
                      ).toLocaleString("en-US", {
                      minimumFractionDigits: transaction.decimal_places
                      }) +
                      " " +
                      transaction.currency_abbreviation
                      }}
                    </b>
                  </div>
                  <!-- <div class="col" style="font-size: 14px;  letter-spacing: 1px;">
                    {{
                    new Date(transaction.date_created).toLocaleTimeString(
                    [],
                    { hour: "2-digit", minute: "2-digit" }
                    )
                    }}
                  </div> -->
                  <div class="col" style="font-size: 14px;  letter-spacing: 1px;">
                    {{ moment(transaction.date_created).tz("Europe/London").format('HH:mm') }}
                  </div> 
                  <div
                    class="col"
                    style="font-size: 14px;  letter-spacing: 1px;"
                  >{{ moment(transaction.date_created).tz("Europe/London").format("DD-MMM-YYYY") }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="transaction_list.length >= skip + 10"
          class="text-center q-mt-xl"
          style="font-size: 16px"
        >
          <a
            id="seeBtn"
            class="bg-default color-default q-pa-md"
            @click="proceedTransactionHistory()"
          >See more</a>
        </div>
        <div
          v-else-if="transaction_list.length > 0"
          class="text-center q-mt-lg"
          style="font-size: 15px"
        >
          <p>End of transaction</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment-timezone";
import {
  postTransactionHistory,
  postWalletDetailsOptions,
} from "../references/url";

export default {
  data: () => ({
    moment: moment,
    tab: "USD",
    transaction_list: [],
    is_shown_history: false,
    skip: 0,
    currency_list: [],
  }),
  async mounted() {
    this.getTransactionHistory();
    this.viewWalletOptions();
    this.getCurrentCurrency();
  },

  methods: {
    async getCurrentCurrency() {
      if (this.$store.state.user.selected_currency.currency.length == 3) {
        this.tab = this.$store.state.user.selected_currency.currency;
      }
    },

    async viewWalletOptions() {
      await this.$_post(postWalletDetailsOptions).then((response) => {
        this.currency_list = response.data.wallet.map((x) => x.currency);
      });
    },
    async getTransactionHistory() {
      if (this.$token) {
        setTimeout(async () => {
          this.skip = 0;
          this.is_shown_history = false;
          this.$q.loading.show();
          await this.$_post(postTransactionHistory, {
            user_id: this.$user_info._id,
            abbreviation: this.tab,
            skip: this.skip,
          }).then((res) => {
            this.$q.loading.hide();
            this.transaction_list = res.data;
          });
          this.is_shown_history = true;
        }, 50);
      }
    },

    async proceedTransactionHistory() {
      if (this.$token) {
        setTimeout(async () => {
          this.skip += 10;
          await this.$_post(postTransactionHistory, {
            user_id: this.$user_info._id,
            abbreviation: this.tab,
            skip: this.skip,
          }).then((res) => {
            for (let i = 0; i < res.data.length; i++) {
              this.transaction_list.push(res.data[i]);
            }
          });
        }, 50);
      }
    },
  },
};
</script>

<style>
/* div.column.items-start{
        max-width: 100px; 
    }  */
#font-sizing {
  font-size: 35px;
}
#transact-history {
  border-radius: 30px;
  border: 4px solid #2f4c7e;
  transition: 0.5s;
  box-shadow: 0px 0px 5px 0.5px #2f4c7e;
  background: white;
}
#transact-history:hover {
  box-shadow: 0px 0px 15px 0.5px #2f4c7e;
}

#container-description-history {
  text-align: left;
}
#second-column {
  text-align: right;
}
#seeBtn {
  text-decoration: none;
}
</style>
<style>
/* @media(min-width: 1024px)
    {
        #second-column{
            text-align: left;
        }
    } */
@media (max-width: 599px) {
  #second-column {
    text-align: left;
  }
  #desktop-transact {
    display: none;
  }
}
@media (min-width: 600px) {
  #mobile-transact {
    display: none;
  }
}
@media (max-width: 400px) {
  #font-sizing {
    font-size: 25px;
  }
}
</style>
