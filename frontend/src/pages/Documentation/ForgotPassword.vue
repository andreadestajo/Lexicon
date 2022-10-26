<template>
<div class="documentation">

<!-- markdown -->
<q-markdown >
UniQX Forgot Password Form
===
</q-markdown>
<!-- /markdown -->

    <div class="component q-ma-lg">
        <div class="form-container">
            <u-q-forgot-password></u-q-forgot-password>
        </div>
    </div>

<!-- markdown -->
<q-markdown >

``` html
{{ code }}
&lt;script&gt;
import UQForgotPassword from '../../components/UQForgotPassword'

export default
{
    data:() =>({ }),
    components: { UQForgotPassword },
    mounted(){ },
    methods: { },
}
&lt;/script&gt;
```
</q-markdown>
<!-- /markdown -->


</div>
</template>

<script>
import UQForgotPassword from '../../components/UQForgotPassword'

export default
{
    data:() =>
    ({
        code: 
`<div class="component q-ma-lg">
    <div class="form-container">
        <u-q-forgot-password></u-q-forgot-password>
    </div>
</div>
`
    }),
    components: { UQForgotPassword },
    mounted(){ },
    methods: { },
}
</script>