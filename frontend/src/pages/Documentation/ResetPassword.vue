<template>
<div class="documentation">

<!-- markdown -->
<q-markdown >
UniQX Reset Password Form
===
</q-markdown>
<!-- /markdown -->

<div class="component q-ma-lg">
    <div class="form-container">
        <u-q-reset-password @success="success()"></u-q-reset-password>
    </div>
</div>

<!-- markdown -->
<q-markdown >

``` html
{{ code }}

&lt;script&gt;
import UQResetPassword from '../../components/UQResetPassword'

export default
{
    data:() =>({ }),
    components: { UQResetPassword },
    mounted(){ },
    methods: 
    {
        success()
        {
            this.$q.notify({ 
                type: `positive`, 
                message:  'The password has been succesfully changed!',
                position: 'top',
                actions: [
                { label: 'Dismiss', color: 'white', handler: () => { /* ... */ } }
                ], 
            });
            setTimeout(function() {
             window.location.reload();
            }, 3000);
        }
    },
}
&lt;/script&gt;
```
</q-markdown>
<!-- /markdown -->


</div>
</template>

<script>
import UQResetPassword from '../../components/UQResetPassword'

export default
{
    data:() =>
    ({
        code: 
`<div class="component q-ma-lg">
    <div class="form-container">
        <u-q-reset-password @success="success()"></u-q-reset-password>
    </div>
</div>
`
    }),
    components: { UQResetPassword },
    mounted()
    {
    },
    methods: 
    {
        success()
        {
            this.$q.notify({ 
                type: `positive`, 
                message:  'The password has been succesfully changed!',
                position: 'bottom-left',
                actions: [
                { label: 'Dismiss', color: 'white', handler: () => { /* ... */ } }
                ], 
            });
            
            setTimeout(function() {
             window.location.reload();
            }, 3000);
        
        }
    },
}
</script>