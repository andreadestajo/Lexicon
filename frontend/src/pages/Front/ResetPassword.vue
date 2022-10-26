<template>
<div>

<div class="component q-ma-lg fixed-center resp" style="max-width: 300px;">
    <div class="form-container">
        <div id="container-reset">
        <u-q-reset-password @success="success()"></u-q-reset-password>
        </div>
    </div>
</div>

</div>
</template>

<script>
import UQResetPassword from '../../components/UQResetPassword'

export default
{
    data:() =>
    ({
       
    }),
    components: { UQResetPassword },
    mounted()
    {
    },
    methods: 
    {
        success()
        {
            // this.$q.notify({
            //         type: 'positive',
            //         message: `The password has been succesfully changed.`,
            //         position: 'bottom-left',
            //         actions: [
            //         { label: 'Dismiss', color: 'white', handler: () => { /* ... */ } }
            //         ],
            //     })
            this.$q.notify({
                message: '<div style="color: green; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>The password has been succesfully changed.</div>',
                position: 'top',
                color: 'white',
                html: true,
            });
            setTimeout(function() {
             location.href = "https://enabler.link/lexicon/#/login";
            }, 2000);
            
        }
    },
}
</script>

<style>
#container-reset
{
    padding: 100px; 
    width: 500px;
    background: white; 
    margin-left: -125px; 
    box-shadow: 10px 10px grey;
}
@media (max-width: 616px)
{
    .resp
    {
        width: 1000px;
    }
}
</style>