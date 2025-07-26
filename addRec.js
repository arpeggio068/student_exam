  function generateUniqueId(length) {
      // สุ่มตัวอักษร a-z และตัวเลข 0-9 ให้ได้ตามจำนวน length
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
  }

  function addNewRec(){
    removeValidate()         
    const newID = generateUniqueId(6)+'-'+generateUniqueId(4)+'-'+generateUniqueId(8)
    const school = $('#school').val()
    const class_ = $('#class_').val()
    let room =  $('#room').val()
    //console.log(typeof(room),"room")
    $('#id_main').val(newID)
    $('#num').val('')
    $('#name').val('')
    $('#form_school').val(school)
    $('#form_class').val(class_)
    $('#form_room').val(room)
    $('#dteeth').val('')
    $('#dcaries').val('')

    const fields_need_dfilling = document.querySelectorAll('input[name="need_dfilling"]');
    Array.prototype.forEach.call(fields_need_dfilling,function(el){               
          el.checked = false;             
    });

    const fields_need_dextract = document.querySelectorAll('input[name="need_dextract"]');
    Array.prototype.forEach.call(fields_need_dextract,function(el){               
          el.checked = false;             
    });

    const fields_need_pfilling = document.querySelectorAll('input[name="need_pfilling"]');
    Array.prototype.forEach.call(fields_need_pfilling,function(el){               
          el.checked = false;             
    });

    const fields_need_sealant = document.querySelectorAll('input[name="need_sealant"]'); 
    Array.prototype.forEach.call(fields_need_sealant,function(el){               
          el.checked = false;             
    });

    $('#dextract').val(0)
    $('#dfilling').val(0)
    $('#pteeth').val('')
    $('#pcaries').val('') 
    $('#need_pextract').val('')
    $('#pextract').val(0)
    $('#pfilling').val(0)
    $('#need_scaling').val(0) 
    $('#etc').val('') 
    $('#dentist').val('') 

    $('#main_select').hide()
    $('#table_app').hide()
    $('#form1').show()  
    showNeed_dfilling()
    showNeed_dextract()
    showNeed_pfilling()
    showNeed_sealant()
  }