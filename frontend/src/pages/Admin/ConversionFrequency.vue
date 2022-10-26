<template>
<div class="documentation">
<!-- **Author: VP -->
<!-- markdown -->
<q-markdown >
Conversion Frequency
===

</q-markdown>
<!-- /markdown -->

<div v-if="$token" class="component q-ma-lg">
    <div class="form-container">
        <u-q-conversion-frequency @success="success()"></u-q-conversion-frequency>
    </div>
</div>

<!-- markdown -->
<q-markdown >

This __component__ is for `Conversion Frequency`

``` html
{{ code }}
```

</q-markdown>
<!-- /markdown -->


</div>
</template>

<script>
import UQConversionFrequency from '../../components/global_settings/UQConversionFrequency'

export default
{
    data:() =>
    ({
        code: `<div class="component q-ma-lg">
    <div class="form-container">
        <u-q-conversion-frequency @success="success()"></u-q-conversion-frequency>
    </div>
</div>`
    }),
    components: { UQConversionFrequency },
    mounted()
    {
    },
    methods:
    {
    },
}
</script>