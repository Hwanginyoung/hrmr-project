$(()=>{

  $('.delete-btn').on('click', (event)=>{
    const btn=$(event.currentTarget);
    const todo_id=btn.attr('todo_id');

    const url='/todolist/'+todo_id;
    $.ajax({
      url:url,
      type:'delete',
      contentType:'application/json',
    })
    .done((response)=>{
      location.reload();
    })
    .fail((response, error)=>{

    })
  });

  $('.stopwatch-btn').on('click', (event)=>{
    const btn=$(event.currentTarget);
    const todo_id=btn.attr('todo_id');
    const url='/stopwatch/'+todo_id;
    console.log(url)
    location.replace('/stopwatch/'+todo_id);
  });

  // 새 할일 등록
  $('#newTodo').on('click', ()=>{
    const newtodotext = $('#newtodotext').val();

    if(newtodotext === ''){
      alert('할 일을 추가하세요.');
      return;
    }

    const data={
      todotext:newtodotext
    }
    $.ajax({
      url:'/todolist',
      type:'post',
      contentType:'application/json',
      data:JSON.stringify(data)
    })
    .done((response)=>{
      //location.replace('/todolist')
      location.reload();
    })
    .fail((request, status, err)=>{
      
    });
  });

  am4core.ready(()=>{
    var container = am4core.create("chartdiv", am4core.Container);
    container.width = am4core.percent(100);
    container.height = am4core.percent(10);

    var interfaceColors = new am4core.InterfaceColorSet();
    var colorSet = new am4core.ColorSet();
    
    var chart = container.createChild(am4plugins_timeline.CurveChart);

    // chart 의 x축, y축, 등등의 설정
    chart.dateFormatter.dateFormat = "yyyy-MM-dd HH:mm";
    chart.dateFormatter.inputDateFormat = "yyyy-MM-ddTHH:mm:ss.SSSZ";
    chart.dy = 90;
    chart.maskBullets = false;

    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "todo_text";
    categoryAxis.renderer.labels.template.paddingRight = 25;
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.renderer.innerRadius = 0;
    categoryAxis.renderer.radius = 100;
    categoryAxis.renderer.grid.template.location = 1;

    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 70;
    dateAxis.min = new Date("2021-11-06 06:00").getTime();
    dateAxis.max = new Date("2021-11-07 06:00").getTime();

    dateAxis.baseInterval = { count: 1, timeUnit: "minute" };
    dateAxis.startLocation = -0.5;

    //dateAxis.renderer.points = [{ x: -400, y: 0 }, { x: -250, y: 0 }, { x: 0, y: 60 }, { x: 250, y: 0 }, { x: 400, y: 0 }];
    dateAxis.renderer.autoScale = false;
    //dateAxis.renderer.polyspline.tensionX = 0.8;
    dateAxis.renderer.tooltipLocation = 0;
    dateAxis.renderer.grid.template.disabled = true;
    dateAxis.renderer.line.strokeDasharray = "1,4";
    dateAxis.renderer.line.strokeOpacity = 0.7;
    dateAxis.tooltip.background.fillOpacity = 0.2;
    dateAxis.tooltip.background.cornerRadius = 5;
    dateAxis.tooltip.label.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
    dateAxis.tooltip.label.paddingTop = 7;

    var labelTemplate = dateAxis.renderer.labels.template;
    labelTemplate.verticalCenter = "middle";
    labelTemplate.fillOpacity = 0.7;
    labelTemplate.background.fill = interfaceColors.getFor("background");
    labelTemplate.background.fillOpacity = 1;
    labelTemplate.padding(7,7,7,7);

    var series = chart.series.push(new am4plugins_timeline.CurveColumnSeries());
    series.columns.template.height = am4core.percent(15);
    series.columns.template.tooltipText = "{categoryX}: [bold]{openDateX}[/] - [bold]{dateX}[/]";

    series.dataFields.openDateX = "start_time";
    series.dataFields.dateX = "end_time";
    series.dataFields.categoryY = "todo_text";
    series.columns.template.propertyFields.fill = "color"; // get color from data
    series.columns.template.propertyFields.stroke = "color";
    series.columns.template.strokeOpacity = 0;

    series.columns.template.adapter.add("fill", function (fill, target) {
      return chart.colors.getIndex(target.dataItem.index * 3);
    })

    var flagBullet1 = new am4plugins_bullets.FlagBullet();
    series.bullets.push(flagBullet1);
    flagBullet1.disabled = true;
    flagBullet1.propertyFields.disabled = "bulletf1";
    flagBullet1.locationX = 1;
    flagBullet1.label.text = "start_time";

    var flagBullet2 = new am4plugins_bullets.FlagBullet();
    series.bullets.push(flagBullet2);
    flagBullet2.disabled = true;
    flagBullet2.propertyFields.disabled = "bulletf2";
    flagBullet2.locationX = 0;
    flagBullet2.background.fill = interfaceColors.getFor("background");
    flagBullet2.label.text = "end_time";

    var bullet = new am4charts.CircleBullet();
    series.bullets.push(bullet);
    bullet.circle.radius = 3;
    bullet.circle.strokeOpacity = 0;
    bullet.locationX = 0;

    bullet.adapter.add("fill", function (fill, target) {
      return chart.colors.getIndex(target.dataItem.index * 3);
    })

    var bullet2 = new am4charts.CircleBullet();
    series.bullets.push(bullet2);
    bullet2.circle.radius = 3;
    bullet2.circle.strokeOpacity = 0;
    bullet2.propertyFields.fill = "color";
    bullet2.locationX = 1;

    bullet2.adapter.add("fill", function (fill, target) {
      return chart.colors.getIndex(target.dataItem.index * 3);
    })

    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.align = "center"
    chart.scrollbarX.width = 800;
    chart.scrollbarX.parent = chart.bottomAxesContainer;
    chart.scrollbarX.dy = - 90;
    chart.scrollbarX.opacity = 0.4;

    var cursor = new am4plugins_timeline.CurveCursor();
    chart.cursor = cursor;
    cursor.xAxis = dateAxis;
    cursor.yAxis = categoryAxis;
    cursor.lineY.disabled = true;
    cursor.lineX.strokeDasharray = "1,4";
    cursor.lineX.strokeOpacity = 1;

    dateAxis.renderer.tooltipLocation2 = 0;
    categoryAxis.cursorTooltipEnabled = false;

    $.ajax({
      url:'/todolist/records',
      type:'get',
      contentType:'application/json',
    })
    .done((response)=>{
      console.log(response)
      chart.data=JSON.stringify(response)
    })
    .fail((request, status, err)=>{
      
    });
  });
});