<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE xsl:stylesheet SYSTEM "ulang://common">
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/1999/XSL/Transform">

    <!-- Шаблон вкладки "Журнал изменений" -->
    <xsl:template match="/result[@method = 'changes']/data">
        <div class="location" xmlns:umi="http://www.umi-cms.ru/TR/umi">
            <xsl:call-template name="entities.help.button" />
        </div>

        <div class="layout">
            <div class="column">
                <div class="phpinfo-container">
                    <xsl:value-of select="data/info" disable-output-escaping="yes"/>
                </div>
            </div>
            <div class="column">
                <xsl:call-template name="entities.help.content" />
            </div>
        </div>
    </xsl:template>

</xsl:stylesheet>
