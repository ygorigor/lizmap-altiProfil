<script type="text/javascript">
  
    var URLAJAXALTICOORD = "{jurl 'altiProfil~ajax:getAlti'}";
    var URLAJAXALTIPROFIL = "{jurl 'altiProfil~ajax:getProfil'}";
    var LOCALES_ALTI_PROFIL = "{@altiProfil~altiProfil.alti.profil@}";
    var LOCALES_ALTI_DISTANCE = "{@altiProfil~altiProfil.alti.distance@}";
    var LOCALES_ALTI_ELEVATION = "{@altiProfil~altiProfil.alti.elevation@}";
    var LOCALES_ALTI_RESOLUTION = "{@altiProfil~altiProfil.alti.resolution@}";
    var LOCALES_ALTI_SLOPE = "{@altiProfil~altiProfil.alti.slope@}";
    var LOCALES_ALTI_ALTITUDE = "{@altiProfil~altiProfil.alti.altitude@}";
    
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
      <button id= "altiProfil-stop" class="btn-altiProfil btn btn-mini btn-error btn-link" title="{@view~map.toolbar.content.stop@}">×</button>
      <span class="icon"></span>
      <span class="text">&nbsp;{@altiProfil~altiProfil.dock.title@}&nbsp;</span>
    </span>
  </h3>
<div id="altiProfil">
  <div class="menu-content">
    <div id="altiProfil_help">{@altiProfil~altiProfil.dock.help@}</div>
    <font size="3">
    <table id="altiProfil_table" style="width:100%" class="table table-condensed table-bordered lizmapPopupTable">
    <colgroup>
       <col span="1" style="width: 10%;">
       <col span="1" style="width: 45%;">
       <col span="1" style="width: 45%;">
    </colgroup>
    <thead style="background-color:lightgray";>
        <tr>
        <th></th>
        <th>{@altiProfil~altiProfil.alti.position@}</th>
        <th>{@altiProfil~altiProfil.alti.altitude@}</th>
        </tr>
        </thead>
        <tbody>
        <tr>
        <td>P1</td>
        <td id="alt-pos1"></td>
        <td id=alt-p1></td>
        </tr>
        <tr>
        <td>P2</td>
        <td id="alt-pos2"></td>
        <td id=alt-p2></td>
        </tr>
        </tbody>
    </table></font>
    <div id="profil-chart">
      <div class="spinner"></div>
      <div id="profil-chart-container"></div>
    </div>  
  </div>
</div>
</div>
