<template>
<div class="documentation">

<!-- markdown -->
<q-markdown >
Uniq Update Profile Form
===

</q-markdown>
<!-- /markdown -->

<div class="component q-ma-lg">
    <div class="form-container">
        <u-q-change-password @success="success()"></u-q-change-password>
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
import UQChangePassword from '../../components/UQChangePassword'

export default
{
    data:() =>
    ({
        code: `<div>hellworld</div><div></div>`
    }),
    components: { UQChangePassword },
    mounted()
    {
    },
    methods:
    {
        success()
        {
            // this.$q.notify({ 
            //     type: `positive`, 
            //     message:  'The password has been succesfully changed!',
            //     position: 'bottom-left',
            //     actions: [
            //     { label: 'Dismiss', color: 'white', handler: () => { /* ... */ } }
            //     ], 
            // });
            this.$q.notify({
                message: '<div style="color: green; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>The password has been succesfully changed.</div>',
                position: 'top',
                color: 'white',
                html: true,
            });
            
            setTimeout(function() {
             window.location.reload();
            }, 3000);
        }
    },
}
</script>