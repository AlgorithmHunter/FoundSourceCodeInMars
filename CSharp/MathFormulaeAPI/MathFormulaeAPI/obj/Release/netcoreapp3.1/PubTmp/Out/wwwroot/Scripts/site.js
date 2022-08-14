const uri = "MathFormulaeAPI/Formulae";
let todos = null;

function getCount(data) {
    const el = $("#Alert");
    let name = "formulae";
    if (data) {
        if (data > 1) {
            name = "formulaes";
        }
        el.text(data + " " + name +" returned.");
    } else {
        el.text("No " + name);
    }
}

$(document).ready(function () {
    getData();
  
    $("#post").on("click", function () {
  
            $("#postColumn").css({ display: "table-cell" });
            $("#PostMenu").css({ display: "block" });
 
            $("#postColumn").css({ display: "none" });

        }

    );
    $("#closePosting").on("click", function (e) {
        e.preventDefault();
        $("#PostMenu").css({ display: "none" });
        $("#postColumn").css({ display: "table-cell" });
    }
    );
    $("#instructions").on("click", function (e) {
        window.location.href = "/Instructions.html";
    });

    initializeDate("EditDateYear", "EditDateMonth", "EditDateDay");
    initializeDate("PostDateYear", "PostDateMonth", "PostDateDay");
});
function initializeDate(YearControlName,MonthControlName,DayControlName) {
    

    for (var i = 1900; i <= new Date().getFullYear(); i++) {
        $("#" + YearControlName).append($("<option></option>").val(i).text(i))
    }
    for (var i = 1; i <=12; i++) {
        $("#" + MonthControlName).append($("<option></option>").val(i).text(i))
    }
    var selectedYear = 1900;
    var selectedMonth = 1;
    for (var i = 1; i < new Date(selectedMonth,selectedYear,0).getDate(); i++) {
        $("#" + DayControlName).append($("<option></option>").val(i).text(i))
    }
   
  
    $("#" + YearControlName).change(function () {
        selectedYear = this.value;
        for (var i = 0; i < new Date(selectedMonth, selectedYear, 0).getDate(); i++) {
            $("#" + DayControlName).append($("<option></option>").val(i).text(i))
        }

    });
    $("#" + MonthControlName).change(function () {
        selectedMonth = this.value;
        for (var i = 1; i < new Date(selectedMonth, selectedYear, 0).getDate(); i++) {
            $("#" + DayControlName).append($("<option></option>").val(i).text(i))
        }
    });
    $("#" + YearControlName).val(selectedYear);
    $("#" + MonthControlName,).val(5);
    $("#" + DayControlName).val(5);

}
function SelectDate(YearControlName, MonthControlName, DayControlName, selectedYear, selectedMonth, selectedDay) {


    $("#" + YearControlName).val(selectedYear);
    $("#" + MonthControlName,).val(selectedMonth);
    $("#" + DayControlName).val(selectedDay);

}
function GetDate(YearControlName, MonthControlName, DayControlName) {

    var Year = $("#" + YearControlName).val();
    var Month =("0"+ $("#" + MonthControlName).val()).slice(-2);
    var Day = ("0" + $("#" + DayControlName).val()).slice(-2);

  
    finalString = Year + "-" + Month + "-" + Day;
  
    return finalString;
}
//The function returns the results from the formulae API
//It uses the ajax call to pass the http method to request data from the api server
//If the api call is succesfull it returns json format data and appends the data to the table
function getData() {
    $.ajax({
        type: "GET",
        url: uri,
       
		
		dataType:"json",
        success: function (data) {
            try { 

           
            
            const tBody = $("#formulaes");

            $(tBody).empty();

            getCount(data.length);

            $.each(data, function (key, item) {
                const tr = $("<tr></tr>")

                    .append($("<td></td>").append($("<table class='form-table data-table'></table>")
                        .append($("<tr></tr>").append($("<th colspan='2' ></th>").text("Formulae Name")))
                        .append($("<tr></tr>").append($("<td colspan='2' ></td>").text(item.name)))
                        .append($("<tr></tr>").append($("<th colspan='2'></th>").text("Formulae Description")))
                        .append($("<tr></tr>").append($("<td colspan='2' ></td>").text(item.description)))
                        .append($("<tr></tr>").append($("<th colspan='2'></th>").text("Formulae Author")))
                        .append($("<tr></tr>").append($("<td colspan='2' ></td>").text(item.author)))
                        .append($("<tr></tr>").append($("<th colspan='2'></th>").text("Date Published")))
                        .append($("<tr></tr>").append($("<td colspan='2' ></td>").text(item.datePublished.split("T")[0])))
                            .append($("<tr></tr>").append(
                                $("<td  class='site-input'></td>").append(
                                    $("<button>Edit</button>").on("click", function () {
                                        editItem(item.id);
                                    })
                                )
                            ).append(
                                $("<td  class='site-input'></td>").append(
                                    $("<button>Delete</button>").on("click", function () {
                                        deleteItem(item.id);
                                    })
                                )

                            )

                            )));

                tr.appendTo(tBody);
            });

                todos = data;
            } catch (ex)
            {
                alert(ex);
            }
        }
    });
}
//This function uses the ajax to make a http post CALL to the Mathformulae api
//first it creates an javascript object named item consisting of all values required by the API post method
//When successfull it will add new values to the api database and return new added values

function addItem() {
    const item = {
        name: $("#add-name").val(),
        description: $("#add-description").val(),
        author: $("#add-author").val(),
        datePublished: GetDate("PostDateYear", "PostDateMonth", "PostDateDay")
   
     
    };
   
    $.ajax({
        type: "POST",
        accepts: "application/json",
        url: uri,
        contentType: "application/json",
        data: JSON.stringify(item),
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown );
        },
        success: function (result) {
            getData();
            $("#add-name").val("");
              $("#add-description").val("");
              $("#add-author").val("");
                
        }
    });
}
//This method makes an ajax call to the server api using http DELETE method
//It passes the api uri with specific id of a formulae to delete from the api server
//if succesfull it will delete the formulae with the id from the api database
function deleteItem(id) {
    $.ajax({
        url: uri + "/" + id,
        type: "DELETE",
        success: function (result) {
            getData();
        }
    });
}
//This method retrieves the formulae to be edited with its values from the todos object
function editItem(id) {
    $.each(todos, function (key, item) {
        if (item.id === id) {
            $("#edit-name").val(item.name);
            $("#edit-id").val(item.id);
            $("#edit-description").val(item.description);
            $("#edit-author").val(item.author);
            var mydate = item.datePublished.split("T")[0];
            var dateoptions = mydate.split("-");           
            SelectDate("EditDateYear", "EditDateMonth", "EditDateDay", dateoptions[0], parseInt(dateoptions[1]), parseInt( dateoptions[2]));
        }
    });
    $("#EditMenu").css({ display: "block" });
    $(window).scrollTop(0);
}
//This method makes an ajax call to the server api using http PUT method
//This call edits the changed values by the user with provided id inside the api database

$("#myform").on("submit", function () {
    try {

        const item = {
            name: $("#edit-name").val(),
            description: $("#edit-description").val(),
            author: $("#edit-author").val(),
            datePublished: GetDate("EditDateYear", "EditDateMonth", "EditDateDay"),
            id: parseInt($("#edit-id").val())
        };
        
        $.ajax({
            url: uri + "/" + $("#edit-id").val(),
            type: "PUT",
            accepts: "application/json",
            contentType: "application/json",
            uploadProgress: function (event, position, total, percentComplete) {
                $("#progressnumber").val(percentComplete);
            },
            data: JSON.stringify(item),
            error: function (jqXHR, textStatus, errorThrown) {
                alert(errorThrown);
            },
            success: function (result) {
               
                getData();
            }
        });

        closeInput();
    } catch (ex) {
        var err = new Error();
        alert(err.stack);
    }
    return false;
});

function closeInput() {
    $("#EditMenu").css({ display: "none" });
}