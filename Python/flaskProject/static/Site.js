

var canLogin = false;
var canRegister = false;
var FileUploadUri = "";

$(document).ready(function () {
   
    var path=window.location.pathname;
    var page=path.split("/").pop();
    if(page.includes("FileUploader"))
    {
        getData();
    }else if(page.includes("FileView"))
    {
        getData();
    }
 
FileUploadUri="/User/FileUploader";
});

let urlParams = {};
(window.onpopstate = function () {
    let match,
        pl = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) {
            return decodeURIComponent(s.replace(pl, " "));
        },
        query = window.location.search.substring(1);

    while (match = search.exec(query)) {
        if (decode(match[1]) in urlParams) {
            if (!Array.isArray(urlParams[decode(match[1])])) {
                urlParams[decode(match[1])] = [urlParams[decode(match[1])]];
            }
            urlParams[decode(match[1])].push(decode(match[2]));
        } else {
            urlParams[decode(match[1])] = decode(match[2]);
        }
    }
})();
function register() {
    try {


        canRegister = requiredFieldValidator("email");
        canRegister = requiredFieldValidator("password");
        canRegister = requiredFieldValidator("username");
        canRegister = requiredFieldValidator("passwordMatch");


        if (canRegister) {

            resetControl("email");
            resetControl("password");
            resetControl("username");
            resetControl("passwordMatch");
        } else {
     
            
            return false;
        }
   
    } catch (ex) {
        alert(ex);
    }


return true;
}

  

function returnToPreviousPage()
{
    window.history.back();
}
function getData() {

    $.ajax({
        type: "GET",
        url: '/User/Files',
        dataType: "json",
        success: function (data) {
            if(Object.keys(data).length!=0)
            {
                
                $("#FileList").empty();
            }else
            {  
                if($("#deleteLink")!=null)
                {
                    $("#deleteLink").css({display:"none"});
                }
               
            }
            
            $(data).each(function (key, item) {
                if(urlParams["fileid"])
                {
                    if(urlParams["fileid"]==item.fileid)
                    {
                        $("#FileList").append($("<tr></tr>").append($("<td></td>").append($("<a href='" + item.fileuri.replace("./","/") + "'>" + item.fileuri.replace("./","/").split("/").pop() + "</a>"))));
                    }
                   
                }else
                {
                    $("#FileList").append($("<tr></tr>").append($("<td></td>").append($("<a href='" + item.fileuri.replace("./","/") + "'>" + item.fileuri.replace("./","/").split("/").pop() + "</a>"))));
                }
               
            }
            )

        }
    });


}
function getFile(fileid) {
    var finalU="/User/Files";
    if(fileid!=-1)
    {
        finalU+="?fileid="+fileid;
    }
   
    $.ajax({
        type: "GET",
        url:finalU ,
        dataType: "json",
        success: function (data) {
            if(Object.keys(data).length!=0)
            {
                
                $("#FileList").empty();
            }else
            {
                $("#deleteLink").css({display:"none"});
            }
            
            $(data).each(function (key, item) {

                $("#FileList").append($("<tr></tr>").append($("<td></td>").append($("<a href='" + item.fileuri.replace("./","/") + "'>" + item.fileuri.replace("./","/").split("/").pop() + "</a>"))));
            }
            )

        }
    });


}
function uploadFile() {
   
    try {

        var Files = $("#file");
        var FileLength = Files[0].files.length;
        var EmailList = $(".email");

        if (FileLength == 0) {

            $("#Errordisplay").text("Please select atleast one file to upload");
            $("#Errordisplay").css({ color: "red" });
            return false;
       } else if (FileLength > 5) {

            $("#Errordisplay").text("Files may not exceed 5");
            $("#Errordisplay").css({ color: "red" });
            return false;

        }
        else {

            $("#Errordisplay").text("");

        }

        var isEmpty = true;
        $.each(EmailList, function (index, item) {

            if (item.value != "") {
                isEmpty = false;
            }
        });

        if (isEmpty) {
            $("#Errordisplay").text("please provide atleast one email address");
            requiredFieldValidator(EmailList[0].id);
            
            return false
        }
   
    } catch (ex) {
        alert(ex);
    }

    return true;

}
function login() {
    try {
       
        canLogin = requiredFieldValidator("email");
        canLogin = requiredFieldValidator("password");

        if (canLogin) {
            resetControl("email");
            resetControl("password");  
        } else {
            
            return false
        }
    } catch (ex) {
        alert(ex);
    }
    return true;
}
function resetControl(controlname) {
    $("#" + controlname).css({ border: "none" });
}
function requiredFieldValidator(controlname) {
    if ($("#" + controlname).val() == "") {
        $("#" + controlname).css({ border: "2px solid red" });
        $("#Errordisplay").text("field cannot be empty");
        $("#Errordisplay").css({ color: "red" });
        return false;
    }
   

    
return true;
}

function passMatch(data) {
    var p = $("#password").val()
    if (p != data.value) {
        $("#Errordisplay").text("passwords don't match");
        canRegister = false;

    } else {
        canRegister = true;
        $("#Errordisplay").text("");
    }

}
function passValidation(data) {
    var reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/;

    var isMatch = new RegExp(reg).test(data.value);
    if (isMatch) {
        $("#Errordisplay").text("");
        canLogin = true;
    } else {
        canLogin = false;
        $("#Errordisplay").text("password must contain atleast 7 none numeric characters & and one single number");
        $("#Errordisplay").css({ color: "red" });
    }

}