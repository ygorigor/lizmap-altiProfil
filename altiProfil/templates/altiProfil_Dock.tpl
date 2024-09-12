<script type="text/javascript">
  
    var URLAJAXALTICOORD = "{jurl 'altiProfil~ajax:getAlti'}";
    var URLAJAXALTIPROFIL = "{jurl 'altiProfil~ajax:getProfil'}";
    var LOCALES_ALTI_PROFIL = "{@altiProfil~altiProfil.alti.profil@}";
    var LOCALES_ALTI_DISTANCE = "{@altiProfil~altiProfil.alti.distance@}";
    var LOCALES_ALTI_ELEVATION = "{@altiProfil~altiProfil.alti.elevation@}";
    var LOCALES_ALTI_RESOLUTION = "{@altiProfil~altiProfil.alti.resolution@}";
    var LOCALES_ALTI_SLOPE = "{@altiProfil~altiProfil.alti.slope@}";
    var LOCALES_ALTI_HELP = "{@altiProfil~altiProfil.dock.help@}";
    
    var ALTI_PROVIDER = "{$altiProvider}";

    {if $altiProvider == "database"}      
      {if $profilUnit == "DEGREES"}
        var LOCALES_ALTI_UNIT = "{@altiProfil~altiProfil.alti.degrees@}";
      {elseif $profilUnit == "PERCENT"}
        var LOCALES_ALTI_UNIT = "{@altiProfil~altiProfil.alti.percent@}";
      {/if}     
    {/if}   
    var LOCALES_ALTI_MEAN = "{@altiProfil~altiProfil.alti.mean@}";  
    var LOCALES_ALTI_DATASOURCE = "{@altiProfil~altiProfil.alti.datasource@}";  
  
</script>
<div class="altiProfil">
  <h3>
    <span class="title">
      <button id= "altiProfil-stop" class="btn-altiProfil btn btn-mini btn-error btn-link" title="{@view~map.toolbar.content.stop@}" onclick="document.querySelector('#button-altiProfil').click();">×</button>
      <span class="icon"></span>
      <span class="text">&nbsp;{@altiProfil~altiProfil.dock.title@}&nbsp;</span>
    </span>
  </h3>
  <div class="menu-content">
    <p>
      {@altiProfil~altiProfil.alti.point1@} : <span id="alt-p1"></span> <br/>
      {@altiProfil~altiProfil.alti.point2@} : <span id="alt-p2"></span>
    </p>
    <div id="profil-chart">
      <div class="spinner"></div>
      <div id="profil-chart-container"></div>
    </div>  
  </div>
</div>