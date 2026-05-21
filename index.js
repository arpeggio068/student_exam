//-------     Waiting/Loading Function                                 -------------// 
//----------------------------------------------------------------------------------//   
  function loadingStart(){
      document.getElementById("loading").classList.remove("invisible");
  }
       
  function loadingEnd(){
      document.getElementById("loading").classList.add("invisible");
  }

  function showSpin3(){
    document.getElementById('resp-spinner1').classList.remove("d-none");
    document.getElementById('resp-spinner2').classList.remove("d-none");
    document.getElementById('resp-spinner3').classList.remove("d-none");
  }

  function hideSpin3(){
    document.getElementById('resp-spinner1').classList.add("d-none");
    document.getElementById('resp-spinner2').classList.add("d-none");
    document.getElementById('resp-spinner3').classList.add("d-none");
  } 

  function showSpin5(){
    document.getElementById('resp-spinner5').classList.remove("d-none");
    document.getElementById('resp-spinner6').classList.remove("d-none");
    document.getElementById('resp-spinner7').classList.remove("d-none");
  }

  function hideSpin5(){
    document.getElementById('resp-spinner5').classList.add("d-none");
    document.getElementById('resp-spinner6').classList.add("d-none");
    document.getElementById('resp-spinner7').classList.add("d-none");
  }
//-------     Waiting/Loading Function                                 -------------// 
//----------------------------------------------------------------------------------// 


//-------     Utility Function                                         -------------// 
//----------------------------------------------------------------------------------// 
  function trim_text(el) {
    el.value = el.value.
    replace(/(^\s*)|(\s*$)/gi, ""). // removes leading and trailing spaces
    replace(/[ ]{2,}/gi, " "). // replaces multiple spaces with one space
    replace(/\n +/, "\n"); // Removes spaces after newlines
    return;
  }

  function letGoTrim(){
    $(function(){
      $("textarea").change(function(){
        trim_text(this);
      });

      $("input").change(function(){
        trim_text(this);
      });
    });
  }
//-------     Utility Function                                         -------------// 
//----------------------------------------------------------------------------------// 

  let arrayOfValues = [];
  let all_rec_student = [];
  var store = localforage.createInstance({
    name: "myDatabaseStudent11454"
  });  
  
  const main_expired_time = 8 * 60 * 60 * 1000; //12 * 60 * 60 * 1000; // 8 hours
  
  function listStudent(){ 
       
     const school = document.getElementById("school").value;
     const class_ = document.getElementById("class_").value;
     const room = document.getElementById("room").value;
     let filterArrayOfValues = []
     if(school !='' && class_ != ''){
       filterArrayOfValues = arrayOfValues.filter(function(r){return r['school'] === school
       && r['class_'] === class_ && r['room'] == room})
       .sort((a,b)=>{
         let c = Number(a['num'])
         let d = Number(b['num'])
         return c-d
       })        
       //list_filter = filterArrayOfValues      

     let result = `<table id="data-table" class="table table-striped table-bordered" style="width:100%">
       <thead>
        <tr>
          <th>ลำดับ</th>
          <th>ชื่อ-สกุล</th>
          <th>บันทึก</th>
        </tr>
       </thead>
     
     `
     filterArrayOfValues.forEach((r,i)=>{
        let clr1 = "black"
        const pcaries = Number(r['pcaries']) // เป็น number อยู่แล้ว

        if (pcaries > 0) {
          clr1 = "red";
        } else if (pcaries === 0 && r['pcaries'] !== '') {
          clr1 = "#3CAF05;";
        }

        result+= `<tr id="${"trId"+i}">
        <td style="color:${clr1};"><input type="hidden" id="${"inputId"+i}" value="${r['id']}">${r['num']}</td>
        <td style="color:${clr1};">${r['name']}</td>
        <td><p style="color:blue" type="button" onclick = "setRec(${i})">บันทึก</p></td>
        </tr>`
       
     })

      result+='</table>'

      $('#table_app').html(result)     
      
    }
    else{
      Swal.fire({
                     position: 'center',
                     icon: 'error',
                     text: "โปรดเลือกโรงเรียนและระดับชั้น",
                     timer:2000
                     
                })      
    }
    
  }  

  async function checkExpired(item_name) {
    try {
      const lUserData = await store.getItem(item_name);
      const init = lUserData || null;
      const now = Date.now();
      const numDays = main_expired_time
      // const numDays = 1 * 24 * 60 * 60 * 1000; // 1 day
      // const numDays = 5 * 60 * 1000; // 5 min

      if (!init || !init.timestamp || (now - init.timestamp > numDays)) {
        clearStudentUI();
        return true;
      } 

      return false;
     
    } catch (err) {
      console.warn("error on checkExpired function:", err);
      // ล้าง UI เผื่อข้อมูลผิดพลาดจริง
      clearStudentUI();
      return true; // ให้ถือว่า expired ไปเลยเพื่อความปลอดภัย
    }
  }

  async function beforeSetTable(){
    try {
      const check = await checkExpired("student_data")
      if(check){
        await store.removeItem("student_data")
        Swal.fire({
            icon: 'warning',
            text: 'ข้อมูลหมดอายุ กรุณาโหลดใหม่',
            showConfirmButton: true,
            timer: 5000
        });
      } else {
        setTable()
      }
    } catch (err) {
      console.error("problem of local cache :", err);
      // ไม่แสดง Swal ซ้ำ เพราะผู้ใช้ต้องโหลดใหม่อยู่ดี
    }
  }


  function setTable(){
     document.getElementById("showBtn").disabled = true;

     if (!Array.isArray(arrayOfValues) || arrayOfValues.length === 0) {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          text: 'ยังไม่มีข้อมูลนักเรียน กรุณาโหลดข้อมูลใหม่',
          showConfirmButton: true
        });

        document.getElementById("showBtn").disabled = false; 
        return;
      }

     listStudent()
     
     setTimeout(function(){
      $('#data-table').DataTable({        
          columnDefs: [
            {
              targets: 0, // คอลัมน์ "ลำดับ"
              render: function (data, type, row) {
                // ให้แปลงค่าก่อน sort เป็นตัวเลข
                return type === 'sort' ? parseInt(data, 10) : data;
              }
            }
          ],
          order: [[0, 'asc']], // เรียงจากน้อยไปมาก
          lengthMenu: [[100, 50, 25,10], [100, 50, 25, 10]]
      });
     },20)
     document.getElementById("showBtn").disabled = false; 
  }

  async function clearSchoolData() {
    if (confirm("ระบบจะล้างข้อมูลนักเรียนในหน่วยความจำ\nยกเว้นข้อมูลที่รออัพโหลด!")) {
      try {
        await store.removeItem("student_data");
        console.log("Main student Data removed successfully");
        // ล้าง UI
        clearStudentUI();
      } catch (error) {
        console.warn("error on remove Main student data: ", error);
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถล้างข้อมูลได้ กรุณาลองใหม่',
        });
      }
    }
  }


  function loadAlert(){
    if (confirm("กด ตกลง เพื่อยืนยันการดาวน์โหลดข้อมูล!")) {
      loadingStart();
      studentLoad();
    }
  }

  async function upLoad() {    
    try {
      const all = await store.getItem("all_rec_student");
      console.log("all_rec_student retrieved successfully");

      const obj = all ? JSON.parse(all) : null;

      if (!obj) {
        alert("ไม่มีข้อมูลให้อัพโหลด");
        return;
      }

      if (confirm("กด ตกลง เพื่อยืนยันการอัพโหลดข้อมูล!")) {
        loadingStart();
        await saveRecord(obj);
      }
    } catch (error) {
      console.error("Error while retrieving or parsing all_rec_student:", error);
      alert("เกิดข้อผิดพลาดระหว่างโหลดข้อมูลจากอุปกรณ์\nกรุณาลองใหม่");
    }

  } 

//--------------   server api -----------------------------------------------------------------------------------------
//--------------   server api -----------------------------------------------------------------------------------------

  const mainUrl = 'https://script.google.com/macros/s/AKfycbwJGTbmZZsLw6mzFqEXlx0Qg7RiorZsxO87pQhJxm_gbU_WE4bsW0Twq66P0vAgSZYuaA/exec' 
  
  async function saveRecord(obj){ 
        const id = getTokenFromUrl(); 
        const obj_json = JSON.stringify({obj:obj,id:id})        
        let formData = new FormData();
        formData.append('action', 'saveRecord');            
        formData.append('data', obj_json);

        try {
            const response = await fetch(mainUrl, {
                method: 'POST',
                redirect: "follow",
                mode: 'cors',
                body: formData,
            });
            const data = await response.json();
            console.log(data.message)

            if (data.status === "success" && data.dataAction === 'keep') {
                await store.removeItem("all_rec_student").then(function() {
                      console.log("Data removed successfully");
                    }).catch(function(error) {
                      console.log("Error while removing data: " + error);
                    });
                $('#val_total').text("  0");
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    text: 'อัพโหลดข้อมูลสำเร็จ!',
                    showConfirmButton: true,
                    timer: 3000
                });              

            }
            else if(data.status === "success" && data.dataAction === 'delete'){
                await store.removeItem("all_rec_student").then(function() {
                      console.log("Data removed successfully");
                    }).catch(function(error) {
                      console.log("Error while removing data: " + error);
                    });
                $('#val_total').text("  0");
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    text: 'อัพโหลดข้อมูลสำเร็จ!',
                    showConfirmButton: true,
                    timer: 2000
                }); 

                await store.removeItem("student_data")                

                setTimeout(function(){
                    Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    text: 'ระบบได้ทำการลบข้อมูลเนื่องจากลิงก์หมดอายุ',
                    showConfirmButton: true
                  });

                },2200)

                clearStudentUI();
                
            }
            else{
              await store.removeItem("student_data")
              Swal.fire({
                position: 'center',
                icon: 'warning',
                text: 'ลิงก์หมดอายุหรือไม่ถูกต้อง',
                showConfirmButton: true
              });

              clearStudentUI();
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                position: 'center',
                icon: 'error',
                text: 'เกิดข้อผิดพลาด โปรดตรวจสอบการเชื่อมต่ออินเตอร์เนต',
                showConfirmButton: true,
                timer: 5000
            });
        } finally {
           loadingEnd()           
           console.log('end load');
        }
  }

  function getTokenFromUrl() {
    return new URLSearchParams(window.location.search).get("id") || "";
  }

  async function studentLoad() {
    const id = getTokenFromUrl();

    //console.log("current URL =", window.location.href);
    console.log("id from URL =", JSON.stringify(id));

    /*if (!id || !String(id).trim().startsWith("token-")) {
      loadingEnd();

      await store.removeItem("student_data");
      clearStudentUI();

      Swal.fire({
        position: "center",
        icon: "warning",
        text: "ไม่พบรหัสลิงก์ token กรุณาเปิดจากลิงก์ที่ได้รับ",
        showConfirmButton: true
      });

      console.log("[studentLoad] blocked: empty or invalid token");
      return;
    }*/

    const obj_json = JSON.stringify({ id });

    let formData = new FormData();
    formData.append("action", "studentLoad");
    formData.append("data", obj_json);

    try {
      const response = await fetch(mainUrl, {
        method: "POST",
        redirect: "follow",
        mode: "cors",
        body: formData,
      });

      const data = await response.json();

      console.log(data.message);
      console.log(data.build);
      console.log(data.res_status);
      console.log(data.req_id);      // เพิ่มจาก server
      console.log(data.token_found); // เพิ่มจาก server

      if (data.status === "success") {
        Swal.fire({
          position: "center",
          icon: "success",
          text: "โหลดข้อมูลสำเร็จ!",
          showConfirmButton: true,
          timer: 3000
        });

        const arrayofArrays = data.student;
        await afterDropdownArrayReturned(arrayofArrays);
        console.log("save student data");

      } else {
        await store.removeItem("student_data");

        Swal.fire({
          position: "center",
          icon: "warning",
          text: "ลิงก์หมดอายุหรือไม่ถูกต้อง",
          showConfirmButton: true
        });

        clearStudentUI();
      }

    } catch (error) {
      console.error("Error:", error);

      Swal.fire({
        position: "center",
        icon: "error",
        text: "เกิดข้อผิดพลาด โปรดตรวจสอบการเชื่อมต่ออินเตอร์เนต",
        showConfirmButton: true,
        timer: 5000
      });

    } finally {
      loadingEnd();
      console.log("end load");
    }
  }
  

  async function offlineArrayReturned() {
    try {
      const check = await checkExpired("student_data")
      if(check){
        await store.removeItem("student_data")

        Swal.fire({
                position: 'center',
                icon: 'warning',
                text: 'ข้อมูลหมดอายุ กรุณาโหลดใหม่',
                showConfirmButton: true,
                //timer: 5000
            });

        //clearStudentUI();
        return;
      }
      
      const lData = await store.getItem("student_data");
      console.log("Offline Data retrieved successfully");
      
      const init = lData ? JSON.parse(lData.arrayofArrays) : [];

      const school = document.getElementById("school");

      if (Array.isArray(init) && init.length > 0) {
        arrayOfValues = init.filter(() => true);  // or keep original filter logic
        addUniqueOptionsToDropdownList(school, arrayOfValues, 'school');
        afterFirstDropdownChanged();
        afterSecondDropdownChanged();
      }

    } catch (error) {
      console.log("Error while retrieving offline data: " + error);
    } finally {
      //loadingEnd();
      console.log("end off line data loaded") 
    }
  }


  async function afterDropdownArrayReturned(arrayofArrays) {
    try {
      clearStudentUI();
      // Save data
      const obj_offline = {
        arrayofArrays: arrayofArrays, // arrayofArrays is json string
        timestamp: Date.now()

      }
      await store.setItem("student_data", obj_offline);
      console.log("Loaded Data saved successfully");

      // Retrieve data
      const lData = await store.getItem("student_data");
      console.log("Student Data retrieved successfully");

      // Parse and use data
      arrayOfValues = JSON.parse(lData.arrayofArrays).filter(function(r){return true;});
      const school = document.getElementById("school");

      if (arrayOfValues) {
        addUniqueOptionsToDropdownList(school, arrayOfValues, 'school');
        afterFirstDropdownChanged();
        afterSecondDropdownChanged();
      }

      // Success message
      Swal.fire({
        position: 'center',
        icon: 'success',
        text: "ดาวน์โหลดสำเร็จ",
        timer: 2000
      });

      
    } catch (error) {
      console.error("Error in afterDropdownArrayReturned:", error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถโหลดข้อมูลได้',
      });
    } finally {
      loadingEnd();
    }
  }

  function afterFirstDropdownChanged(){     
     const class_ = document.getElementById("class_");
     const school = document.getElementById("school").value;
     const filterArrayOfValues = arrayOfValues.filter(function(r){return r['school'] === school});
     addUniqueOptionsToDropdownList(class_,filterArrayOfValues,'class_'); 
     afterSecondDropdownChanged();
  }

 function afterSecondDropdownChanged(){
     const room = document.getElementById("room");
     const school = document.getElementById("school").value;
     const class_ = document.getElementById("class_").value;
     const filterArrayOfValues = arrayOfValues.filter(function(r){return r['school'] === school && r['class_'] === class_ });
     addUniqueOptionsToDropdownList(room,filterArrayOfValues,'room');   
  } 

  function addUniqueOptionsToDropdownList(el,arrayofArrays,obj){    
    let currentlyAdded = [];
    el.innerHTML = '';
    arrayofArrays.forEach(function(r){
      if(currentlyAdded.indexOf(r[obj])=== -1){
        let option = document.createElement("option"); 
        option.textContent = r[obj];
        el.appendChild(option);
        currentlyAdded.push(r[obj]);
       }
     });  
  }

  async function loadPendingUploadData() {
    try {
      const all = await store.getItem("all_rec_student");
      console.log("all_rec_student retrieved successfully");

      all_rec_student = [];

      if (all) {
        try {
          const parsed = JSON.parse(all);

          if (Array.isArray(parsed)) {
            all_rec_student = parsed;
          } else {
            console.warn("all_rec_student is not an array");
          }
        } catch (e) {
          console.warn("Invalid JSON in all_rec_student:", e);
        }
      }

      // ต้องแสดงจำนวนเสมอ แม้ link/token จะหมดอายุ
      $('#val_total').text(" " + all_rec_student.length);

      return all_rec_student;

    } catch (error) {
      console.error("Error while loading all_rec_student:", error);
      all_rec_student = [];
      $('#val_total').text(" 0");
      return [];
    }
  }

  

  async function callOffLineData() { // offline data + pending upload
    try {
      // โหลดข้อมูลนักเรียนเฉพาะกรณี student_data ยังใช้ได้
      await offlineArrayReturned();

      // โหลดข้อมูลรอ upload เสมอ
      await loadPendingUploadData();

    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        text: 'เกิดข้อผิดพลาดในการเรียกข้อมูล off line โปรดลองใหม่อีกครั้ง',
        showConfirmButton: true
      });
      console.error("Fetch Error:", error.message);
    } finally {
      loadingEnd();
    }
  }

  

  async function getDataAPI(url) {
    try {
      console.log("========== getDataAPI START ==========");
      console.log("[GET] url =", url);

      const response = await fetch(url, {
        method: 'GET',
      });

      const data = await response.json();

      console.log("[GET] response data =", data);

      if (data.data && data.data.length > 0) {        

        //console.log("[GET] gData =", gData);
        //console.log("[GET] gId set from gData[0] =", JSON.stringify(gId));
        console.log("[GET] status =", data.status);
        console.log("[GET] message =", data.message);
        console.log("[GET] req_id =", data.req_id);
        console.log("[GET] token_found =", data.token_found);
        console.log("[GET] token_match =", data.token_match);
        console.log("[GET] found_row =", data.found_row);

        Swal.fire({
          position: 'center',
          icon: 'success',
          text: 'ลิงก์ web ถูกต้อง',
          showConfirmButton: true,
          timer: 3000
        });

        await callOffLineData();

        return true;
      } else {
        gId = '';

        console.log("[GET] token invalid, gId cleared");

        Swal.fire({
          position: 'center',
          icon: 'warning',
          text: 'ลิงก์หมดอายุหรือไม่ถูกต้อง',
          showConfirmButton: true
        });

        console.warn('Token not found or expired');

        await store.removeItem('student_data');

        clearStudentUI();

        await loadPendingUploadData();

        return false;
      }

    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        text: 'เกิดข้อผิดพลาดในการเชื่อมต่อ โปรดลองใหม่อีกครั้ง',
        showConfirmButton: true
      });

      console.error("[GET] Fetch Error:", error.message);

      await loadPendingUploadData();

      return false;

    } finally {
      loadingEnd();
      console.log("========== getDataAPI END ==========");
    }
  }

  function clearStudentUI() {
    // 1) ทำลาย DataTable เดิมก่อนล้าง HTML
    if ($.fn.DataTable && $.fn.DataTable.isDataTable('#data-table')) {
      $('#data-table').DataTable().clear().destroy();
    }

    // 2) ล้าง dropdown และ table
    $('#school').empty();
    $('#class_').empty();
    $('#room').empty();
    $('#table_app').empty();

    // 3) ล้างตัวแปรข้อมูลนักเรียนใน memory
    arrayOfValues = [];

    // 4) กันปุ่มแสดงตารางใช้งานตอนยังไม่มีข้อมูล
    const showBtn = document.getElementById("showBtn");
    if (showBtn) {
      showBtn.disabled = false;
    }
  }


//--------------   server api -----------------------------------------------------------------------------------------
//--------------   server api -----------------------------------------------------------------------------------------
  

  function preventFormSubmit(){
      const forms = document.querySelectorAll('form');
      for (let i = 0; i < forms.length; i++) {
           forms[i].addEventListener('submit', function(event) {
              event.preventDefault();
           });
      }
  }

  $.extend(true, $.fn.dataTable.defaults, {
    "language": {
              "sProcessing": "กำลังดำเนินการ...",
              "sLengthMenu": "แสดง _MENU_ แถว",
              "sZeroRecords": "ไม่พบข้อมูล",
              "sInfo": "แสดง _START_ ถึง _END_ จาก _TOTAL_ แถว",
              "sInfoEmpty": "แสดง 0 ถึง 0 จาก 0 แถว",
              "sInfoFiltered": "(กรองข้อมูล _MAX_ ทุกแถว)",
              "sInfoPostFix": "",
              "sSearch": "ค้นหา:",
              "sUrl": "",
              "oPaginate": {
                            "sFirst": "เริ่มต้น",
                            "sPrevious": "ก่อนหน้า",
                            "sNext": "ถัดไป",
                            "sLast": "สุดท้าย"
              }
     }
  }); 


  //let gUrl, gId, gData;  
  

 

  /*document.addEventListener("DOMContentLoaded", async function () {
    try {
      loadingStart();
      console.log("========== DOMContentLoaded START ==========");

      await loadPendingUploadData();

      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");

      console.log("[DOM] current URL =", window.location.href);
      console.log("[DOM] id from URL =", JSON.stringify(id));

      if (!id) {
        loadingEnd();
        console.log("[DOM] No ID found in URL.");

        Swal.fire({
          position: 'center',
          icon: 'warning',
          text: 'ไม่พบรหัสลิงก์ token',
          showConfirmButton: true
        });

        return;
      }

      const gUrl = mainUrl + '?id=' + id;

      const LOADED_EXPIRY_MS = main_expired_time;
      const loadedKey = 'loaded:' + id;
      const stored_exp = await store.getItem(loadedKey);
      const now = Date.now();

      console.log("[DOM] gUrl =", gUrl);
      console.log("[DOM] loadedKey =", loadedKey);
      console.log("[DOM] main_expired_time =", LOADED_EXPIRY_MS);
      console.log("[DOM] stored_exp =", stored_exp);

      if (stored_exp) {
        console.log("[DOM] cache age ms =", now - stored_exp.timestamp);
        console.log("[DOM] cache valid =", now - stored_exp.timestamp < LOADED_EXPIRY_MS);
      }

      if (stored_exp && stored_exp.dataLoaded && now - stored_exp.timestamp < LOADED_EXPIRY_MS) {
        console.log("✅ [DOM] use localForage loaded cache, skip API check");
        //gId = id;

        //console.log("[DOM] gId set from URL/cache =", JSON.stringify(gId));

        await callOffLineData();

      } else {
        console.log("⏰ [DOM] cache expired or not found, check API");

        const ok = await getDataAPI(gUrl);

        console.log("[DOM] getDataAPI ok =", ok);

        if (ok) {
          await store.setItem(loadedKey, {
            timestamp: now,
            dataLoaded: true
          });

          console.log("[DOM] saved loaded cache =", loadedKey);
        }
      }

    } catch (error) {
      console.error("[DOM] Unexpected error:", error);
    } finally {
      letGoTrim();
      preventFormSubmit();
      console.log("========== DOMContentLoaded END ==========");
    }
  });*/

  document.addEventListener("DOMContentLoaded", async function () {
    try {
      loadingStart();
      console.log("========== DOMContentLoaded START ==========");

      // โหลดจำนวนข้อมูลที่รอ upload เสมอ
      await loadPendingUploadData();

      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");

      console.log("[DOM] current URL =", window.location.href);
      console.log("[DOM] id from URL =", JSON.stringify(id));

      if (!id) {
        loadingEnd();
        console.log("[DOM] No ID found in URL.");

        Swal.fire({
          position: 'center',
          icon: 'warning',
          text: 'ไม่พบรหัสลิงก์ token',
          showConfirmButton: true
        });

        return;
      }

      const url = mainUrl + '?id=' + encodeURIComponent(id);

      // ใช้ timestamp ของ student_data แทน loadedKey
      const studentCache = await store.getItem("student_data");
      // studentCache เป็น object จาก localForage แล้ว ไม่ต้อง JSON.parse()
      // ตอนใช้ข้อมูลนักเรียนค่อย parse เฉพาะ arrayofArrays:
      const now = Date.now();

      const studentCacheValid =
        studentCache &&
        studentCache.timestamp &&
        now - studentCache.timestamp < main_expired_time;

      console.log("[DOM] studentCache =", studentCache);
      console.log("[DOM] studentCache age ms =", studentCache?.timestamp ? now - studentCache.timestamp : null);
      console.log("[DOM] studentCache valid =", studentCacheValid);

      if (studentCacheValid) {
        console.log("✅ [DOM] use student_data cache, skip API check");

        await callOffLineData();

      } else {
        console.log("⏰ [DOM] student_data expired or not found, check API");

        const ok = await getDataAPI(url);

        console.log("[DOM] getDataAPI ok =", ok);
      }

    } catch (error) {
      console.error("[DOM] Unexpected error:", error);
    } finally {
      letGoTrim();
      preventFormSubmit();
      loadingEnd();
      console.log("========== DOMContentLoaded END ==========");
    }
  });

  window.onbeforeunload = function(event) {    
    event.preventDefault();
    event.returnValue = ''; // จำเป็นสำหรับบางเบราว์เซอร์ (เช่น Chrome) 
      //return confirm('Confirm refresh');
  };

  

