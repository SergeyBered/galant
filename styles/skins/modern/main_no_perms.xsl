<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE xsl:stylesheet SYSTEM	"ulang://common">

<xsl:stylesheet version="1.0" exclude-result-prefixes="xlink"
				xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
				xmlns:xlink="http://www.w3.org/TR/xlink">

	<xsl:output doctype-system="about:legacy-compat" method="html" encoding="utf-8"/>

	<xsl:include href="main.xsl" />

	<xsl:template match="/">
		<html>
			<head>
				<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
				<meta http-equiv="X-UA-Compatible" content="IE=edge" />

				<title>
					<xsl:value-of select="$title" />
				</title>

				<link type="text/css" rel="stylesheet" href="/styles/skins/modern/design/css/grid.css?{$system-build}" />
				<link type="text/css" rel="stylesheet" href="/styles/skins/modern/design/css/main.css?{$system-build}" />
				<link type="text/css" rel="stylesheet" href="/styles/skins/modern/design/css/sweetalert2.css?{$system-build}" />

				<script type="text/javascript" src="/ulang/{$iface-lang}/common/content/date/{$module}?js;{$system-build}" charset="utf-8" />
				<script type="text/javascript" src="/styles/common/js/node_modules/jquery/dist/jquery.js?{$system-build}" />
				<script type="text/javascript" src="/styles/common/js/jquery/jquery-migrate.js?{$system-build}" />
				<script type="text/javascript" src="/styles/common/js/jquery/jquery-ui.js?{$system-build}" />

				<script src="/styles/common/js/node_modules/underscore/underscore-min.js?{$system-build}"/>
				<script src="/styles/skins/modern/design/js/common/compressed.min.js?{$system-build}"/>
				<script type="text/javascript" src="/styles/common/js/cms/admin.js?{$system-build}"/>
				<script src="/styles/skins/modern/design/js/sly.min.js?{$system-build}"/>
				<script src="/styles/skins/modern/design/js/main.js?{$system-build}"/>
			</head>
			<body>
				<div id="main" class="main">
					<div class="nav">
						<xsl:apply-templates select="$modules-menu" />

						<div class="select-modules">
							<span class="big-ico" style="background-image: url('/styles/skins/modern/design/img/icons/modules.png');" />
							<span class="title">&modules;</span>
						</div>

						<xsl:apply-templates select="$favorites" />
					</div>
					<div class="container">
						<div class="head">
							<xsl:call-template name="user-menu" />
							<xsl:apply-templates select="$site-langs" />
						</div>
						<div class="content">
							<div class="no-permissions-area">
								<xsl:value-of select="document('udata://system/getNoPermissionsAdminStubData')/udata" disable-output-escaping="yes" />
							</div>
						</div>
					</div>
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
