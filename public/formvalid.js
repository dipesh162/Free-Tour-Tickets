

    function validation(){
        var celebName = document.getElementById("script").getAttribute("data-name");

		var firstname  = document.myform.firstname.value,
            secondname = document.myform.secondname.value,
            email      = document.myform.email.value,
            number     = document.myform.number.value;
            sketch     = document.myform.sketch.value;
            cover      = document.myform.cover.value;

        if(firstname == ""){
        	alert("Please enter your first name");
        	return false;
            }

        if(secondname == ""){
            alert("Please enter your first name");
            return false;
            }

        if(!isNaN(firstname)){
            alert("Please enter a valid name");
            return false;
            }

        if(!isNaN(secondname)){
            alert("Please enter a valid name");
            return false;
            }            

        if(email == ""){
        	alert("Please enter your email");
        	return false;
            }

        if(number == ""){
        	alert("Please enter your mobile number");
        	return false;
            }

        if(isNaN(number)){
           alert("Please enter a valid mobile number");
        	return false;
            }

        if(number.length<10 || number.length>10){
           alert("Mobile number should be of 10 digits");
        	return false;
            }

        if(sketch == "" && cover == ""){
        	alert("Please upload any " +  celebName + "\'s" + " sketch or cover song");
        	return false;
            }

        if(sketch == "" || cover !== ""){
        		return true;
        	}
        
        if(sketch !== "" || cover == ""){
        	    return true;
            }
        }      