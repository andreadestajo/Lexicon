<template>
<div class="hello">
    <div class="background-bg account__container">
          <div class="text-center icon bg-default color-default" style="border-radius: 20px 20px 0 0">
        <!-- <i class="fa fa-wallet q-mr-sm"></i> -->
        <span id="balance">
          <div id="header-h6">
            <b>
              <p
                id="font-sizing"
                class="deposit-css-transfer q-py-md font-bebas"
              >Add Another Currency Account</p>
            </b>
          </div>
        </span>
      </div>
      <div class="q-pa-md">
    <q-form>
        <div class="row">
            <div class="col-8 q-mr-md">
                <q-select
                    class="dropdown-select q-pb-md full-width"
                    outlined
                    dense
                    v-model="form_data.currency"
                    use-input
                    hide-selected
                    fill-input
                    behavior="menu"
                    input-debounce="0"
                    label="Currency"
                    :rules="[val => !!val || '* Field is required']"
                    :options="form_data.is_fiat ? currencyOptions : cryptoOptions"
                    @filter="filterFn"
                    @input="handleChange"
                >
                    <template v-slot:no-option>
                    <q-item>
                        <q-item-section class="text-grey font-monseratt">No results</q-item-section>
                    </q-item>
                    </template>
                </q-select>
            </div>
            <div class="col-3">
                <q-btn
                    label="Add"
                    @click="addNewCurrency"
                    class="full-width bg-default color-default"
                />
            </div>
        </div>
    </q-form>
    <label>Accounts Management</label>
    <draggable class="effect q-mt-md" ghost-class="ghost">
            <div class="sortable" v-for="element in updateds" :key="updateds.indexOf(element)">
                <strong>{{element.currency}} - {{element.currency_name}}</strong>
            </div>
    </draggable>
      </div>
    </div>
</div>
</template>

<script>
 import draggable from 'vuedraggable';
 import currencyObjects from "../references/currency_objects";
 import { postAddNewCCY } from "../references/url";
 import { postSupportedCCY } from "../references/url";
 import { postWalletDetailsOptions } from "../references/url";
 import currencyList from "../references/currency_list";
 import cryptoList from "../references/crypto_list";
 import cryptoObject from "../references/crypto_object";

    export default {
        components: {
            draggable,
        },
        data: () => ({
            form_data:
            {
                currency_name: "",
                is_fiat: true,
                number_code: "",
                currency: "",
                decimal_places: null,
            },
            currencyOptions: [],
            currencyOptionsCode : [],            
            cryptoOptions: cryptoList,
            currencyObject: currencyObjects,
            cryptoObject: cryptoObject,
            options: [
            {
                label: "Fiat",
                value: true,
            },
            {
                label: "Crypto",
                value: false,
            },
            ],
            is_show_send_success: false,
            optionss: [],
        }),
        async mounted()
        {
            await this.getAccount();
            await this.convertToCode();
        },
        computed:
        {
            updateds()
            {
                return this.optionss;
            }
        },
        methods: 
        {
            async getAccount()
            {
                await this.$_post(postWalletDetailsOptions).then((response) => 
                {
                    this.optionss = response.data.wallet;
                });
            },
            async convertToCode()
            {
                this.$q.loading.show();
                let res = await this.$_post(postSupportedCCY);
                this.$q.loading.hide();
                
                if(res)
                {
                    this.currencyOptionsCode = [...res.data.map(x => x.name)].filter(x => ![...this.optionss.map(y => y.currency_name)].includes(x));
                }    
            },
            async addNewCurrency()
            {
                if(this.form_data.number_code == '')
                {
                    this.$q.notify({
                        message: '<div style="color: red; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i> Please choose a currency. </div>',
                        position: 'top',
                        color: 'white',
                        html: true,
                    });
                }
                else
                {
                    this.$q.loading.show();
                    let res = await this.$_post(postAddNewCCY, this.form_data);
                    this.$q.loading.hide();
                    console.log(this.form_data)
                    if(res.status == 200) 
                    {
                        this.$q.notify({
                            message: '<div style="color: green; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i> Account successfully created. </div>',
                            position: 'top',
                            color: 'white',
                            html: true,
                        });
                        this.form_data.currency_name = this.form_data.name
                        this.optionss.push(this.form_data);
                        // window.location.reload();
                    }
                }
            },
            filterFn(val, update) 
            {
                if (val === "") 
                {
                    update(() => {
                    if (this.form_data.is_fiat) {
                        this.currencyOptions = this.currencyOptionsCode;
                    } else {
                        this.cryptoOptions = cryptoList;
                    }
                    });
                    return;
                }

                update(() => 
                {
                    const needle = val.toLowerCase();
                    if (this.form_data.is_fiat) {
                    this.currencyOptions = this.currencyOptionsCode.filter(
                        (v) => v.toLowerCase().indexOf(needle) > -1
                    );
                    } else {
                    this.cryptoOptions = cryptoList.filter(
                        (v) => v.toLowerCase().indexOf(needle) > -1
                    );
                    }
                });
            },

            async handleChange() 
            {
                if (this.form_data.is_fiat == true) 
                {   
                    this.form_data.number_code  = this.currencyObject[this.form_data.currency].number_code;
                    this.form_data.name  = this.form_data.currency;
                    this.form_data.currency = this.currencyObject[this.form_data.currency].abbreviation;
                    this.form_data.decimal_places = 2;
                } 
                else 
                {
                    this.form_data.currency = this.cryptoObject[
                    this.form_data.name
                    ].abbreviation;
                    this.form_data.decimal_places = this.cryptoObject[
                    this.form_data.name
                    ].decimal_places;
                }
            },
        },
    }
 
</script>

<style scoped lang="scss">
.account__container {
  border-radius: 30px;
  border: 4px solid #2f4c7e;
  transition: 0.5s;
  box-shadow: 0px 0px 5px 0.5px #2f4c7e;
  
}
.account__container:hover {
  box-shadow: 0px 0px 15px 0.5px #2f4c7e;
}
.background-bg
{
    background: white;
}
.hello
{
    padding: 0 400px;
}
.cont-shadows {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
}
@media (max-width: 1312px)
{
         .hello
        {
            padding: 0 300px;
        }
}
@media (max-width: 1060px)
{
         .hello
        {
            padding: 0 200px;
        }
}
@media (max-width: 716px)
{
         .hello
        {
            padding: 0 100px;
        }
}
@media (max-width: 516px)
{
         .hello
        {
            padding: 0 10px;
        }
}
strong
{
    display: inline-block;
}
.sortable
{
    width: 100%;
    background: white;
    border: 2px solid #e6e6e6;
    padding: 1em;
    cursor: move;
    margin-bottom: 2px;

        span
        {
            float: right;
   }
}
.hello .sortable-drag
{
    opacity: 0;
}
.dropdown-select
{
    width: 50%;
}
.ghost
{
    border-left: 6px solid #2f4c7e;
    box-shadow: 10px 10px 5px -1px rgba(0,0,0,0.14);
    opacity: .7;
}
.add_account_title
{
    font-size: 20px;
    text-align: center;
    font-weight: bold;
}
</style>