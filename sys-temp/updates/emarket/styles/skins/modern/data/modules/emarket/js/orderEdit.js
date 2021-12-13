(function($, window, DefaultModule) {

	/** @type {Array} controlRelations список полей которые нужно обновлять при изменении домена */
	let controlRelations = [];

	$('div.domain_field select').on('change', function() {
		let domainId = $(this).val();
		controlRelations.forEach(function(controlRelation) {
			controlRelation.loadItemsAll(null, false, {'domainId': domainId});
		});
	});

	$("div.order-relation").each(function() {
		$orderDomainId = $('div.domain_field select').val();
		let e = $(this);
		let controlRelation = new ControlRelation({
			container: e,
			type: e.attr("umi:type"),
			id: e.attr("id"),
			empty: (e.attr("umi:empty") === "empty"),
			sourceUri: '/admin/data/guideItemsForDomain/',
			getParam: {'domainId': $orderDomainId}
		});
		controlRelations.push(controlRelation);
	});

}(jQuery, window, DefaultModule));