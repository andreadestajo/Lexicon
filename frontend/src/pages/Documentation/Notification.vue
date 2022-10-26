<template>
<div class="documentation">

<!-- markdown -->
<q-markdown >
Notifications
===

</q-markdown>
<!-- /markdown -->

<div class="component q-ma-lg">
    <div class="form-container">
        <u-q-notification @success="success()"></u-q-notification>
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
import UQNotification from '../../components/UQNotification'

export default
{
    data:() =>
    ({
        code: `<div>hellworld</div><div></div>`
    }),
    components: { UQNotification },
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