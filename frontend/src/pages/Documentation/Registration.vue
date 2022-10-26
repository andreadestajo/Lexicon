<template>
<div class="documentation">

<!-- markdown -->
<q-markdown >
UniQX Registration Form
===
</q-markdown>
<!-- /markdown -->

<div class="component q-ma-lg">
    <div class="form-container">
        <u-q-registration @success="success()"></u-q-registration>
    </div>
</div>

<!-- markdown -->
<q-markdown >

``` html
{{ code }}

&lt;script&gt;
import UQRegistration from '../../components/UQRegistration'
export default
{
    data:() =>
    ({ }),
    components: { UQRegistration },
    mounted() { },
    methods:
    {
        success()
        {
            this.$q.dialog({ title: `Registration  Successful!`, message:  'The account has been succesfully created!' });
        }
    },
}
&lt;/script&gt;
```0
</q-markdown>
<!-- /markdown -->

</div>
</template>

<script>
import UQRegistration from '../../components/UQRegistration'

export default
{
    data:() =>
    ({
code: 
`<div class="component q-ma-lg">
    <div class="form-container">
        <u-q-registration @success="success()"></u-q-registration>
    </div>
</div>`
    }),
    components: { UQRegistration },
    mounted()
    {
    },
    methods:
    {
        success()
        {
            // this.$q.notify({ 
            //     type: `positive`, 
            //     message:  'The account has been succesfully created!',
            //     position: 'bottom-left',
            //     actions: [
            //     { label: 'Dismiss', color: 'white', handler: () => { /* ... */ } }
            //     ], 
            // });
            this.$q.notify({
                message: '<div style="color: green; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>The account has been succesfully created.</div>',
                position: 'top',
                color: 'white',
                html: true,
            });
        }
    },
}
</script>