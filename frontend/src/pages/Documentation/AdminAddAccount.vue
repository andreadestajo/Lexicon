<template>
<div class="documentation">

<!-- markdown -->
<q-markdown >
Admin Add Account
===

</q-markdown>
<!-- /markdown -->

<div class="component q-ma-lg">
    <div class="form-container">
        <u-q-admin-add-account @success="success()"></u-q-admin-add-account>
    </div>
</div>

<!-- markdown -->
<q-markdown >

The __code above__ can be `bla blab abla`

``` html
{{ code }}
```

</q-markdown>
<!-- /markdown -->


</div>
</template>

<script>
import UQAdminAddAccount from '../../components/Admin/UQAdminAddAccount'

export default
{
    data:() =>
    ({
        code: `<div>hellworld</div><div></div>`
    }),
    components: { UQAdminAddAccount },
    mounted()
    {
    },
    methods:
    {
        success()
        {
            this.$q.dialog({ title: `Registration  Successful!`, message:  'The account has been succesfully updated!' });
        }
    },
}
</script>