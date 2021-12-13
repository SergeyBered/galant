<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE xsl:stylesheet SYSTEM	"ulang://common/umiStub">
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<!-- Шаблон поля "Название" в первой группе форм редактирования|создания сущностей объектного типа без базового -->
	<xsl:template match="group[position() = 1 and count(../../basetype) = 0]" mode="form-modify-group-fields-name">
		<xsl:call-template name="std-form-name">
			<xsl:with-param name="value" select="../../@name" />
			<xsl:with-param name="label" select="'&label-ip-address;'" />
			<xsl:with-param name="show-tip">
				<xsl:text>0</xsl:text>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:template>

</xsl:stylesheet>