<template>
  <div>
    <div class="wallet__container">
      <div class="text-center text-h6 q-mb-md bg-default color-default" style="border-radius: 20px 20px 0px 0px" id="header-h6">
        <p class="deposit-css q-py-lg">
          <b style="letter-spacing: 1px">Crypto</b>
        </p>
      </div>
      <div class="q-pa-md">
        <!-- View Options -->
        <div>
          
          <!-- List of Currency -->
          <div style="cursor: pointer;">
            <div
              class="currency-list active-wallet"
            >
              <q-btn
                flat
                icon="img:details.png"
                round
                id="mobile-info"
                size="20px"
                @click="is_show_receive =  true"
              />
              <div class="row">
                <!-- :class="{'active-wallet': index == indexNumber}" -->
                <div id="desktop-info" class="col-2 flex flex-center">
                  <q-btn
                    flat
                    icon="img:details.png"
                    round
                    size="20px"
                    style="margin-top: 0px"
                    @click="is_show_receive =  true"
                  />
                </div>
                <div class="col-sm-4 col-12 flex flex-center">
                  <span
                    style="font-size: 20px; font-weight: 450;"
                    class="font-raleway"
                  >BTC</span>
                </div>
                <span
                  id="balance-position"
                  class="col-sm-6 col-12 wallet-balance-container"
                >
                <div class="column">
                    <div>
                  <strong style="font-size: 25px;">
                   0.0132243
                  </strong>
                  </div>
                  <div>
                   <strong style="font-size: 25px;">
                    <div id="balance-position" style="font-size: 14px;">
                      <i class="fas fa-exchange-alt"></i>
                      <strong
                        style="font-size: 14px; margin-left: 10px;"
                      >USD 141.02</strong>
                    </div>
                  </strong>
                  </div>
                  </div>
                </span>
              </div>
            </div>
          </div>
          <br />
          <div style="font-size: 16px" class="text-right q-mr-md">
            <span class="font-raleway q-mr-sm">Total Account Balance in USD:</span>
            <strong
              style="font-size:30px"
            >141.02</strong>
          </div>
        </div>

        <!-- Send Form Dialog -->
        <q-dialog persistent>
          <q-card>
            <q-card-section class="row items-center q-pb-none">
              <div class="text-h6">sadawda</div>
              <q-space />
              <q-btn
                icon="close"
                flat
                round
                dense
                v-close-popup
              />
            </q-card-section>

            <q-card-section align="center" style="width: 450px;">
              <div>
                <span style="font-size: 20px; font-weight: 400; letter-spacing: 3px;">SEND</span>
              </div>

              <u-q-wallet-send
              ></u-q-wallet-send>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Receive Dialog -->
        <q-dialog>
          <q-card style="width: 400px">
            <q-card-section class="row items-center q-pb-none">
              <div class="text-h6">hhaha</div>
              <q-space />
              <q-btn icon="fas fa-times" round class="close-btn-ico" unelevated v-close-popup></q-btn>
            </q-card-section>

          </q-card>
        </q-dialog>

        <!-- Forgot Security 1 Dialog -->
        <q-dialog>
          <q-card style="width: 400px">
            <q-card-section>
              <div class="text-center">
                <i class="fas fa-envelope" style="font-size: 70px;"></i>
                <!-- <i class="far fa-thumbs-up" style="font-size: 70px;"></i> -->
                <p class="field q-mt-md" style="font-weight: bold;font-size:20px;">Check your email!</p>
                <p
                  class="field text-center"
                >We just sent you an email with a link to reset your security question and answer.</p>
                <q-btn color="accent" v-close-popup>Close</q-btn>
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Forgot Security 2 Dialog -->
        <q-dialog>
          <q-card style="width: 400px">
            <q-card-section>
              <div class="text-center">
                <i class="fas fa-envelope" style="font-size: 70px;"></i>
                <!-- <i class="far fa-thumbs-up" style="font-size: 70px;"></i> -->
                <p class="field q-mt-md" style="font-weight: bold;font-size:20px;">Check your email!</p>
                <p
                  class="field text-center"
                >We just sent you an email with a link to reset your security question and answer.</p>
                <q-btn color="accent" v-close-popup>Close</q-btn>
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "krypto",
  data() {
    return {
    };
  },
};
</script>

<style>
.wallet__container {
   border-radius: 30px;
  border: 2px solid #2f4c7e;
  transition: 0.5s;
  box-shadow: 0px 0px 5px 0.5px #2f4c7e;
  background: #fff;
}
.wallet__container:hover {
  box-shadow: 0px 0px 15px 0.5px #2f4c7e;
}
#balance-position {
  text-align: right;
}
.close-btn-ico {
  transition: transform 0.5s;
}
.close-btn-ico:hover {
  transform: rotate(180deg);
}
.currency-list {
  border-radius: 5px;
  height: auto;
  padding: 20px 20px 20px 20px;
  margin-bottom: 10px;
  box-shadow: 0px 0px 5px 0.5px grey;
  transition: 0.5s;
}
.active-wallet {
  box-shadow: 0px 0px 2px 3px #2f4c7e; 
}
.question__lock
{
   border: 2px solid #2f4c7e;
  border-left: 5px solid #2f4c7e;
  border-radius: 10px;
}
.currency_list {
  cursor: pointer;
}
.hide {
  display: none;
}
.wallet-balance-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.btn-transactions {
  border-radius: 50%;
  height: 50px;
  width: 50px;
  background: #2f4c7e;
  color: white;
}
</style>

<style>
@media (max-width: 599px) {
  #balance-position {
    text-align: center;
  }
  #desktop-info {
    display: none;
  }
  .wallet-balance-container {
    justify-content: center;
  }
}
@media (min-width: 600px) {
  #mobile-info {
    display: none;
  }
}
</style>