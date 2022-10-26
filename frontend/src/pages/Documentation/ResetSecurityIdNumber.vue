<template>
<div class="documentation">

<!-- markdown -->
<q-markdown >
UniQX Reset Security via ID Number
===
</q-markdown>
<!-- /markdown -->

<div class="component q-ma-lg">
    <div class="form-container">
        <u-q-reset-security-id-number></u-q-reset-security-id-number>
    </div>
</div>

<!-- markdown -->
<q-markdown >

``` html
{{ code }}
</q-markdown>
<!-- /markdown -->


</div>
</template>

<script>
import UQResetSecurityIdNumber from '../../components/UQResetSecurityIdNumber'

export default
{
    data:() =>
    ({
        code: 
`<div class="component q-ma-lg">
    <div class="form-container">
        <u-q-reset-question-answer-id-number></u-q-reset-question-answer-id-number>
    </div>
</div>
`
    }),
    components: { UQResetSecurityIdNumber },
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