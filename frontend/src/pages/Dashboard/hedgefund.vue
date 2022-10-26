<template>
  <div>
    <div class="text-center text-h6 q-mb-md bg-default color-default" style="border-radius: 20px 20px 0 0" id="header-h6">
      <p class="deposit-css q-py-lg">
        <b style="letter-spacing: 1px">Hedge Fund</b>
      </p>
    </div>
    <div class="q-px-md q-pt-sm q-pb-md">
      <div class="q-gutter-y-md q-mb-lg" style="z-index: -99">
        <div class="q-mt-md">
          <div class="text-center"></div>

          <div>
            <!-- approve -->
            <div v-if="hedge_fund_list.length == 0" class="text-center">
              <p>
                <b>No existing transaction</b>
              </p>
            </div>
            <div
              class="q-mb-md"
              style="border-left: 4px solid #2f4c7e; border-radius: 5px;"
              v-for="hedge_fund in hedge_fund_list"
              :key="hedge_fund._id"
            >
              <div class="row q-pa-md hedge__hover">
                <div class="col-sm-7 col-12">
                  <div class="col font-monseratt">
                    <!-- Icons -->
                    <div class="column">
                      <div class="col">
                        <!-- end of icons -->
                        <div class="text-default" style="font-size: 20px">
                          <b>{{ hedge_fund.fund_type }}</b>
                          <q-separator />
                        </div>
                      </div>

                      <div class="col text-left">
                        <div style="font-size: 20px">
                          <b>
                            {{ hedge_fund.currency_abbreviation }}
                            <strong
                              id="hedge-desktop-remove"
                              style="font-size: 25px"
                            >
                              {{
                              (
                              hedge_fund.amount /
                              10 ** hedge_fund.decimal_places
                              ).toLocaleString("en-US", {
                              minimumFractionDigits: hedge_fund.decimal_places
                              })
                              }}
                            </strong>
                          </b>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column font-monseratt">
                    <div class="col">
                      <div class="interest-title" v-if="hedge_fund.status == 'Approved'">
                        Annual Return:
                        <span
                          id="hedge-desktop-remove"
                          class="interest-text font-monseratt"
                          v-if="hedge_fund.status == 'Approved'"
                        >
                          <b>{{hedge_fund.rate}} %</b>
                        </span>
                      </div>
                      <div class="interest-title" v-if="hedge_fund.status == 'pending'">
                        Status:
                        <span
                          id="hedge-desktop-remove"
                          class="interest-text font-monseratt"
                          v-if="hedge_fund.status == 'pending'"
                        >
                          <b>Pending</b>
                        </span>
                      </div>
                    </div>
                    <div class="col" v-if="hedge_fund.status == 'Approved'">
                      <div>
                        Projected Value:
                          <span
                          id="hedge-desktop-remove"
                          class="interest-text font-monseratt"
                          v-if="hedge_fund.status == 'Approved'"
                        >
                          <b>{{ (hedge_fund.projected_value / 10 ** hedge_fund.decimal_places).toLocaleString("en-US", {
                              minimumFractionDigits: hedge_fund.decimal_places,
                              maximumFractionDigits: hedge_fund.decimal_places
                              })
                            }}</b>
                        </span>
                        <br id="desktop-remove2" />
                      
                      </div>
                    </div>
                    <div class="col" v-if="hedge_fund.status == 'Approved'">
                      <div>
                        Contract Period:
                        <br id="desktop-remove2" />
                         <span
                          id="hedge-desktop-remove"
                          class="interest-text font-monseratt"
                          v-if="hedge_fund.status == 'Approved'"
                        >
                          <b>{{ moment(hedge_fund.date_from).tz("Europe/London").format('DD-MMM-YYYY')}} to {{ moment(hedge_fund.date_to).tz("Europe/London").format('DD-MMM-YYYY')}}</b>
                        </span>
                       
                      </div>
                    </div>
                  </div>
                </div>
                <div id="hedge-mobile-remove" class="col-sm-5 col-12">
                  <div id="item-end">
                    <br />
                    <!-- Via {{ transaction.transaction_method }} -->
                    <div style="letter-spacing: 1px; font-size:20px">
                      <span>
                        <strong style="font-size: 30px">
                          {{
                          (
                          hedge_fund.amount /
                          10 ** hedge_fund.decimal_places
                          ).toLocaleString("en-US", {
                          minimumFractionDigits: hedge_fund.decimal_places
                          })
                          }}
                        </strong>
                        <div>
                          <div
                            id="hedge-mobile-remove"
                            class="interest-text font-monseratt"
                            v-if="hedge_fund.status == 'Approved'"
                          >{{hedge_fund.rate}} %</div>

                          <div
                            id="hedge-mobile-remove"
                            class="interest-text font-monseratt"
                            v-if="hedge_fund.status == 'Approved'"
                          > <b>{{ (hedge_fund.projected_value / 10 ** hedge_fund.decimal_places).toLocaleString("en-US", {
                              minimumFractionDigits: hedge_fund.decimal_places,
                              maximumFractionDigits: hedge_fund.decimal_places
                              })
                            }}</b></div>

                              <div
                            id="hedge-mobile-remove"
                            class="contract-text font-monseratt"
                            v-if="hedge_fund.status == 'Approved'"
                          >  <b>{{ moment(hedge_fund.date_from).tz("Europe/London").format('DD-MMM-YYYY')}} to {{ moment(hedge_fund.date_to).tz("Europe/London").format('DD-MMM-YYYY')}}</b></div>

                           
                          <div
                            id="hedge-mobile-remove"
                            class="interest-text font-monseratt"
                            v-if="hedge_fund.status == 'pending'"
                          >Pending</div>
                        </div>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment-timezone";
import { postHedgeFundList } from "../../references/url";

export default {
  data: () => ({
    hedge_fund_list: [],
    moment: moment,
  }),
  mounted() {
    this.getHedgeFundList();
  },
  methods: {
    async getHedgeFundList() {
      if (this.$token) {
        setTimeout(async () => {
          // this.skip = 0;
          // this.is_shown_history = false;
          this.$q.loading.show();
          await this.$_post(postHedgeFundList, {
            user_id: this.$user_info._id,
          }).then((res) => {
            this.$q.loading.hide();

            this.hedge_fund_list = res.data;
          });
          // this.is_shown_history = true;
        }, 50);
      }
    },
  },
};
</script>

<style>
.hedge__hover {
  transition: 0.5s;
  box-shadow: 0px 0px 5px 0.5px #2f4c7e;
}
.hedge__hover:hover {
  box-shadow: 0px 0px 15px 0.5px #2f4c7e;
}
.q-tab__label {
  font-size: 30px;
}
.cont-shadows {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
}
.interest-text {
  font-size: 14px;
}
.contract-text {
  font-size: 12px;
}
.interest-title {
  font-size: 16px;
}
#item-end {
  text-align: right;
}
</style>

<style>
@media (max-width: 599px) {
  #item-end {
    text-align: left;
  }
   #hedge-mobile-remove {
    display: none;
  }
}
@media (min-width: 600px) {
  #desktop-remove2 {
    display: none;
  }
}
@media (min-width: 599px) {
  #hedge-desktop-remove {
    display: none;
  }
}
</style>
