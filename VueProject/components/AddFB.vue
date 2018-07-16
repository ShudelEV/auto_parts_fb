<template>
<div>
    <form class="uk-grid-small" uk-grid>
        <div class="uk-width-1-1">
            <h2>Add Your Feedback</h2>
        </div>
        <div class="uk-width-1-2@s">
            <label class="uk-form-label" for="part"> *Part</label>
            <select id="part" class="uk-select">
                <option>Add..</option>
                <option>Option 01</option>
                <option>Option 02</option>
            </select>
        </div>
        <!--Car section-->
        <div class="uk-width-1-2@s">
            <label class="uk-form-label" for="car">Car</label>
            <select id="car" class="uk-select">
                <option>Add..</option>
                <option>Option 01</option>
                <option>Option 02</option>
            </select>
        </div>
        <!--Description-->
        <div class="uk-width-1-1@s">
            <textarea class="uk-textarea" rows="5" placeholder="*Feedback"></textarea>
        </div>
        <!--Stars-->
        <div class="uk-width-1-1@s">
            <vue-stars>
                <vk-icon icon="star" class="fill-star" slot-scope="props" slot="activeLabel"></vk-icon>
                <vk-icon icon="star" slot-scope="props" slot="inactiveLabel"></vk-icon>
            </vue-stars>
        </div>
        <!--Add images-->
        <div class="uk-width-1-1@s">
            <div uk-form-custom>
                <input type="file">
            <button class="uk-button uk-button-default" type="button" tabindex="-1">Select Img</button>
        </div>
        </div>
    </form>
    <article class="uk-comment">
        <div class="uk-comment-meta uk-margin-top"> * - Requirement fields</div>
    </article>
</div>
</template>

<script>
export default {
    name: 'AddFB',

    props: ['brandName']
}
</script>

<style>
    .uk-icon svg[meta='vk-icons-star'] { color: gold; }
    .uk-icon.fill-star svg[meta='vk-icons-star'] polygon { fill: #fdff00; }
</style>
