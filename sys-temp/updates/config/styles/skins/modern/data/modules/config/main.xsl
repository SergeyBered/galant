<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE xsl:stylesheet SYSTEM "ulang://common">
<xsl:stylesheet version="1.0"
				xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
>

	<!-- Вкладка "Глобальные" модуля "Конфигурация" -->
	<xsl:template match="/result[@method = 'main']//group" mode="settings.modify">
		<script type="text/javascript" src="/styles/skins/modern/data/modules/config/js/main.js" />

		<table class="btable btable-striped config-main" style="margin-bottom:200px;">
			<tbody>
				<xsl:apply-templates select="option[@name = 'keycode']" mode="keycode"/>
				<xsl:apply-templates select="option[@name != 'keycode']" mode="settings.modify.table">
					<xsl:with-param name="title_column_width" select="'65%'" />
					<xsl:with-param name="value_column_width" select="'35%'" />
				</xsl:apply-templates>
			</tbody>
		</table>

		<xsl:apply-templates select="/result/@demo" mode="stopdoItInDemo" />
	</xsl:template>

	<!-- Шаблон поля "Доменный ключ" -->
	<xsl:template match="option" mode="keycode">
		<tr>
			<td width="65%">
				<div class="title-edit">
					<xsl:value-of select="@label" />
				</div>
			</td>
			<td class="keycode-edit">
				<a>
					<i id="keycode-edit" class="small-ico i-edit" title="&label-edit;" alt="&label-edit;" />
				</a>
				<input type="text" class="default" name="{@name}" value="{value}" id="{@name}" readonly="readonly"/>
			</td>
		</tr>
	</xsl:template>
</xsl:stylesheet>
