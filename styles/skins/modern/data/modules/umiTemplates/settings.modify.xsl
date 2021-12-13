<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE xsl:stylesheet SYSTEM "ulang://common">
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<!-- Шаблон вкладки "Редактор" -->
	<xsl:template match="/result[@method = 'getTemplateEditor']/data[@type = 'settings' and @action = 'modify']">
		<div class="title">
			<h2>&label-design-templates;</h2>
		</div>
		<iframe width="100%" height="700px">
			<xsl:attribute name="src">
				<xsl:value-of select="concat('/styles/common/other/elfinder/TemplateEditor.html?lang=', $iface-lang)"/>
			</xsl:attribute>
		</iframe>
	</xsl:template>

</xsl:stylesheet>