//AJAX Loader for all Ajax calls
$(document).ajaxSend(function (event, request, settings) {
    $('#loading-indicator').show();
});

$(document).ajaxComplete(function (event, request, settings) {
    $('#loading-indicator').hide();
});

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results[1] || 0;
}

var loadSpaceApps = function(spaceID) {
    //fix default Menu selection at UI level
    $('.space-menu a').attr("class", "not-active");
    //  $(this).attr("class","space-menu active");
    $('#' + spaceID).attr("class","active");
    console.log($(this));
    //$('#cfapps').innerHTML = "";
    $.cookie('defaultCFSpace',spaceID);
    var table = $('#cfapps').DataTable();
    table.destroy();
    $('#cfapps').empty();
    loadcfapps(spaceID);
}

var performAppAction = function(action, guid) {
    var strUrl = "";
    if (action =="start")
        strUrl = "/api/startapp/" + guid;
    else
        strUrl = "/api/stopapp/" + guid;
    $.ajax({
        url: strUrl,
        success: function (result) {
            console.log(result);
            var spaceID = $.cookie('defaultCFSpace');
            var table = $('#cfapps').DataTable();
            table.destroy();
            $('#cfapps').empty();
            loadcfapps(spaceID);
        }
    });
}

var openAppinNewTab = function (guid) {
    $.ajax({
        url: "/api/route/" + guid,
        success: function (result) {
            //console.log(result.url);
            OpenInNewTab(result.url);
        }
    });
}

function OpenInNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
}

function createTableRow(item) {
    line = "";
    try {
        var buildpack = item.entity.detected_buildpack;
    } catch (e) {
        var buildpack = item.entity.buildpack;
    }

    var line =
        "<tr class='" + (item.entity.state == 'STARTED' ? 'state-running' : 'state-stopped') + "'>" +
        "<td>" + //App Name and running Status
        "<p id='" + item.metadata.guid + "' class='fa fa-circle' style='color:" + (item.entity.state == 'STARTED' ? 'green' : 'firebrick') + "'>  </p> " +
        item.entity.name + //Link to open in New Tab
        (item.entity.state == 'STARTED' ? " <a class='fa fa-external-link' href='#' onClick=openAppinNewTab('" + item.metadata.guid + "')></a>" : "") +
        "</td>" +
        "<td>" + item.entity.memory + " MB *" + item.entity.instances + //Memory and Instance Details
        "</td>" +
        "<td>" +
        jQuery.trim(buildpack).substring(0, 30).trim(this) + "..." +
        "</td>" +
        "<td style='font-size: 20px'>" +
        (item.entity.state != 'STARTED' ?
            "<a href='#' onclick=performAppAction('start','" + item.metadata.guid + "') class='tooltip-button'>" + //Start App Action Button
            "<p class='fa fa-play-circle-o ' style='color:green' data-toggle='tooltip' data-placement='left' title='' data-original-title='Start Application'> " +
            "</p>" +
            "</a>" :
            "<a href='#' onclick=performAppAction('stop','" + item.metadata.guid + "') class='tooltip-button'> " + //Stop App Action Button
            "<p class='fa fa-dot-circle-o' style='color:firebrick' data-toggle='tooltip' data-placement='left' title='' data-original-title='Stop Application'> </p>" +
            "</a> "
        ) +
        " <a href='#' class='tooltip-button'><p class='fa fa-trash-o' style='color:red' data-toggle='tooltip' data-placement='right' title='' data-original-title='Delete DISABLED'> </p></a>" + //Delete App Action Button
        "</td>" +
        "</tr>";

    return line;
}

var loadcfapps = function(defaultCFSpace) {
    $.ajax({
        url: "/api/spaceapps/" + defaultCFSpace, success: function (result) {
            $('.cfapps').css('display', 'block');
            //initialize header
            var line =  "<thead><tr><th>Name</th><th>Memory</th><th>Runtime</th><th>Actions</th></tr></thead>"
            $(line).appendTo('#cfapps');
            var arrResults = $(result.resources);
            arrResults.each(function (count) {
                var item = arrResults[count];
                var line = createTableRow(item);
                $(line).appendTo('#cfapps');
            });
            $('.tooltip-button').tooltip({
                selector: "[data-toggle=tooltip]",
                container: "body"
            });
            //initialize footer
            var line =  "<tfoot><tr><th>Name</th><th>Memory</th><th>Runtime</th><th>Actions</th></tr></tfoot>"
            $(line).appendTo('#cfapps');
            var dataTable = $('#cfapps').DataTable({
                "paging":   false,
                dom:'Bfrtip',
                buttons: [
                    'selectAll',
                    'selectNone',
                    {
                        text: 'Select Running',
                        action: function () {
                            // console.log(dataTable.rows());
                            //console.log(dataTable.row(0).data());
                            //dataTable.rows().select();
                            dataTable.rows().deselect();
                            var rows = dataTable.rows('.state-running');
                            rows.select();
                        }
                    },
                    {
                        text: 'Select Stopped',
                        action: function () {
                            dataTable.rows().deselect();
                            var rows = dataTable.rows('.state-stopped');
                            rows.select();
                        }
                    },
                    {
                        text: 'Start',
                        action: function () {
                            var arrSelectedItems = dataTable.rows( { selected: true } ).data();
                            var count = dataTable.rows( { selected: true } ).count();
                            for (i=0; i < count; i++) {
                                var selection = arrSelectedItems[i];
                                console.log($(selection[0]).attr('id'));
                            }
                            arrSelectedItems.forEach(function(item){

                            })

                            events.prepend( '<div>'+count+' row(s) selected</div>' );
                        }
                    },
                    {
                        text: 'Stop',
                        action: function () {
                            var count = dataTable.rows( { selected: true } ).count();

                            events.prepend( '<div>'+count+' row(s) selected</div>' );
                        }
                    },
                    {
                        text: 'Delete',
                        action: function () {
                            var count = dataTable.rows( { selected: true } ).count();

                            events.prepend( '<div>'+count+' row(s) selected</div>' );
                        }
                    }
                ],
                select: true
            });
        }
    });
}

$(document).ready(function () {
    $.ajax({
        url: "/api/cfspaces", success: function (result) {
            //$('.cfapps').css('display', 'block');
            var space_id = $.cookie('defaultCFSpace');
            var arrResults = $(result.resources);
            var firstitem = arrResults[0];
            arrResults.each(function (count) {
                var item = arrResults[count];
                if((space_id == null && count == 0) || (space_id != null && space_id == item.metadata.guid) ){
                    var line = "<li class = 'space-menu'><a class='active' id='" + item.metadata.guid + "' onclick=loadSpaceApps('" + item.metadata.guid + "') href='#'> " + item.entity.name + "</a></li>";
                }else {
                    var line = "<li class = 'space-menu'><a  id='" + item.metadata.guid + "' onclick=loadSpaceApps('" + item.metadata.guid + "') href='#'> " + item.entity.name + "</a></li>";
                }
                $(line).appendTo('#us-spaces');
            });

            if($.cookie('defaultCFSpace') == null){
                //set default Space as first value
                $.cookie('defaultCFSpace',firstitem.metadata.guid);
                console.log('loading first Space Apps');
                $('#loading-indicator').show();
                loadcfapps($.cookie('defaultCFSpace'));
            }
        }
    });

    if($.cookie('defaultCFSpace') != null) {
        console.log('loading default Space Apps');
        loadcfapps($.cookie('defaultCFSpace'));
    }

});