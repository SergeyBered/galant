<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE xsl:stylesheet SYSTEM "ulang://common">

<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:umi="http://www.umi-cms.ru/TR/umi">

	<xsl:template match="udata[@module = 'config' and @method = 'menu']">
		<div class="other-modules">
			<div class="modules connect " umi-key="menuTop">
				<xsl:apply-templates select="items/item[not(@type) ]" />
			</div>
			<div class="modules connect" umi-key="menuBottom">
				<xsl:apply-templates select="items/item[@type = 'system']" />
				<xsl:apply-templates select="items/item[@type = 'util']" />
			</div>
		</div>
	</xsl:template>

	<xsl:template match="udata[@module = 'config' and @method = 'menu']/items/item">
		<a class="module" href="{$lang-prefix}/admin/{@name}/" umi-module="{@name}" >
			<span class="big-ico" style="background-image: url('{document(concat('udata://', @name, '/getIconPath/'))/udata}');"></span>
			<span class="title"><xsl:value-of select="@label" /></span>
		</a>
	</xsl:template>
</xsl:stylesheet>
