<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE xsl:stylesheet SYSTEM "ulang://common">
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:template match="/result[@method = 'lists']/data[@type = 'list' and @action = 'view']">
		<script src="/styles/skins/modern/data/modules/umiRedirects/removeAllRedirects.js?{$system-build}" />

		<div class="tabs-content module">
			<div class="section selected">
				<div class="location">
					<div class="imgButtonWrapper loc-left" style="bottom:0px;">
						<a id="addRedirectButton" class="btn color-blue loc-left"
						   href="{$lang-prefix}/admin/umiRedirects/add/">&label-button-add-redirect;</a>

						<a id="removeAllRedirectsButton" class="btn color-blue loc-left">
							&label-button-remove-all-redirects;
						</a>
					</div>

					<xsl:call-template name="entities.help.button" />
				</div>
				<div class="layout">
					<div class="column">
						<div id="tableWrapper" />
						<script src="/styles/common/js/node_modules/underscore/underscore-min.js?{$system-build}" />
						<script src="/styles/common/js/backbone.compiled.min.js?{$system-build}" />
						<script src="/styles/skins/modern/design/js/dataView/app.min.js?{$system-build}" />
						<script>
							(function(){
								new umiDataController({
								container:'#tableWrapper',
								prefix:'/admin/umiRedirects',
								module:'umiRedirects',
								controlParam:'',
								dataProtocol: 'json',
								domain:1,
								lang:1,
								configUrl:'/admin/umiRedirects/flushDataConfig/.json',
								debug:true
								}).start();
							})()
						</script>
					</div>
					<div class="column">
						<xsl:call-template name="entities.help.content" />
					</div>
				</div>
			</div>

		</div>

	</xsl:template>

</xsl:stylesheet>
