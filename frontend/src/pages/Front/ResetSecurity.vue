<template>
<div>

<div class="component q-ma-lg fixed-center resp" style="max-width: 300px;">
    <div class="form-container">
        <div style="padding: 100px; width: 500px; background: white; margin-left: -125px; box-shadow: 10px 10px grey;">
        <u-q-reset-security></u-q-reset-security>
        </div>
    </div>
</div>

</div>
</template>

<script>
import UQResetSecurity from '../../components/UQResetSecurity'

export default
{
    data:() =>
    ({
       
    }),
    components: { UQResetSecurity },
    mounted()
    {
    },
    methods: 
    {

    },
}
</script>

<style>
@media (max-width: 616px)
{
    .resp
    {
        width: 1000px;
    }
}
</style>