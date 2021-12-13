<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE xsl:stylesheet SYSTEM "ulang://common">
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/1999/XSL/Transform">

	<!-- Шаблон вкладки "phpInfo" -->
	<xsl:template match="/result[@method = 'phpInfo']/data">
		<xsl:apply-templates select="data/alert" />
		<div class="phpinfo-container">
			<xsl:value-of select="data/info" disable-output-escaping="yes"/>
		</div>
	</xsl:template>

	<!-- Шаблон предупреждения -->
	<xsl:template match="data/alert">
		<div class="column">
			<div id="errorList">
				<p class="error"><strong>&label-alert-header;</strong></p>
				<ol class="error">
					<xsl:value-of select="." disable-output-escaping="yes"/>
				</ol>
			</div>
		</div>
	</xsl:template>

</xsl:stylesheet>
