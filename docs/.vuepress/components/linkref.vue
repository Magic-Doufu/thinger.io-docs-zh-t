<template>
	<a :href="$withBase(path)" class="d-flex py-3 link-ref my-3">
		<div class="flex-shrink-1 d-inline-block align-self-center pl-4">
			<span class="oi oi-arrow-thick-right"></span>
		</div>
		<div class="flex-grow-1 text-left align-self-center px-4">
			<strong>
	    		{{title}}
	    	</strong>
		</div>
		<div class="flex-shrink-1 text-right align-self-center px-4" style="color: #ccc;">
			<small>
	    		{{path}}
			</small>
		</div>
	</a>
</template>
<script type="text/javascript">
module.exports = {
	props: ['title', 'path']
}
</script>
<style lang="css">
	a.link-ref {
		font-size: 1.2rem;
		border: 1px #eee solid;
		border-radius: 3px;
		background-color: #fff;
		text-decoration: none !important;
	}
	a.link-ref:hover {
		background-color: #fafdff;
	}
</style>