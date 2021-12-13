<?= '<?xml version="1.0" encoding="utf-8"?>';?>
<result xmlns:xlink="http://www.w3.org/TR/xlink">
	<data>
		<?php  ?>
		<error code="<?= $v540d6b8df248755646c4345fc70c2629->code;?>" type="<?= $v540d6b8df248755646c4345fc70c2629->type;?>"><?= $v540d6b8df248755646c4345fc70c2629->message;?></error>
		<?php
  if (DEBUG_SHOW_BACKTRACE):   ?>
			<backtrace><?php
   $v29d5f56fb4447d05677b6226b698efe5 = explode("\n", $v540d6b8df248755646c4345fc70c2629->traceAsString);foreach ($v29d5f56fb4447d05677b6226b698efe5 as $v04a75036e9d520bb983c5ed03b8d0182):    ?>
				<trace><?= $v04a75036e9d520bb983c5ed03b8d0182 ?></trace><?php
   endforeach;?></backtrace><?php
  endif;?>
	</data>
</result>