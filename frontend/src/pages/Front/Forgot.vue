<template>
<div class="component q-ma-lg fixed-center resp" style="max-width: 300px;">
    <div class="form-container">
        <div id="container-forgot">
        <u-q-forgot-password></u-q-forgot-password>
        </div>
    </div>
</div>
</template>


<script>
import UQForgotPassword from '../../components/UQForgotPassword'

export default
{
    data:() =>
    ({
        code: `<div>hello world</div>`
    }),
    components: { UQForgotPassword },
    mounted()
    {
    },
    methods: { },
}
</script>
<style>
#container-forgot
{
    padding: 100px; 
    width: 500px; 
    background: white; 
    margin-left: -125px; 
    box-shadow: 10px 10px grey;
}
</style>