// Function to get parameter from localStorage
function getLocalStorageParameter(name) {
    return localStorage.getItem(name) || '';
}

// Function to fill form fields from localStorage
document.addEventListener('DOMContentLoaded', function () {
    function fillFormFields() {
        var requestNumber = getLocalStorageParameter('requestNumber');
        var requestid = getLocalStorageParameter('requestid');
        var requesterName = getLocalStorageParameter('requesterName');
        var fullname = getLocalStorageParameter('fullname');
        var companyName = getLocalStorageParameter('companyName');
        var sector = getLocalStorageParameter('sector');
        var ssec = getLocalStorageParameter('ssec');
        var secText = getLocalStorageParameter('secText');
        var ssecText = getLocalStorageParameter('ssecText');
        var surveyTeamId = getLocalStorageParameter('surveyTeamId');
        var areaRequest = getLocalStorageParameter('areaRequest');

        if (requestNumber) {
            var requestNumberField = document.querySelector('input[name="request-number"]');
            if (requestNumberField) {
                requestNumberField.value = requestNumber;
            }
        }


        if (requestid) {
            var requestidField = document.querySelector('input[name="requestid"]');
            if (requestidField) {
                requestidField.value = requestid;
            }
        }
        if (requesterName) {
            var requesterNameField = document.querySelector('input[name="requester-name"]');
            if (requesterNameField) {
                requesterNameField.value = requesterName;
            }
        }

        if (fullname) {
            var fullnameField = document.querySelector('input[name="applicant-name"]');
            if (fullnameField) {
                fullnameField.value = fullname;
            }
        }

        if (companyName) {
            var companyNameField = document.querySelector('input[name="company-name"]');
            if (companyNameField) {
                companyNameField.value = companyName;
            }
        }
        if (ssec) {
            var ssecField = document.querySelector('input[name="ssec"]');
            if (ssecField) {
                ssecField.value = ssec;
            }
        }

        if (sector) {
            var sectorField = document.querySelector('input[name="sector"]');
            if (sectorField) {
                sectorField.value = sector;
            }
        }


        if (secText) {
            var secTextField = document.querySelector('input[name="secText"]');
            if (secTextField) {
                secTextField.value = secText;
            }
        }


        if (ssecText) {
            var ssecTextField = document.querySelector('input[name="ssecText"]');
            if (ssecTextField) {
                ssecTextField.value = ssecText;
            }
        }



        if (surveyTeamId) {
            var surveyTeamIdField = document.querySelector('input[name="company-code"]');
            if (surveyTeamIdField) {
                surveyTeamIdField.value = surveyTeamId;
            }
        }

        if (areaRequest) {
            var areaRequestField = document.querySelector('input[name="area_request"]');
            if (areaRequestField) {
                areaRequestField.value = areaRequest;
            }
        }
    }

    // Call fillFormFields when DOM is fully loaded
    fillFormFields();
});
// Canvas and Drawing Settings
var canvas = new fabric.Canvas('map-canvas');
var isDrawing = false;
var points = [];
var ctx = canvas.getContext('2d', { willReadFrequently: true });
var northArrowImageSrc = 'images/North-Arrow.png';
var signaturePadApplicant;
var signaturePadSurveyor;
// إعداد الخلفية
canvas.setBackgroundColor('rgb(255, 255, 255)', canvas.renderAll.bind(canvas));

fabric.Image.fromURL(northArrowImageSrc, function (img) {
    img.set({
        left: 6,
        top: 6,
        scaleX: 0.05, // تصغير عرض الصورة بنسبة 5%
        scaleY: 0.03,
        selectable: false,
        evented: false
    });
    img.set('id', 'northArrow'); // تعيين معرف للصورة
    canvas.add(img);
    canvas.renderAll();
});

// Enable Free Drawing
function startDrawing() {
    canvas.isDrawingMode = true;
}

function exportCanvasImage() {
    return new Promise((resolve) => {
        var canvas = document.getElementById('canvas-id'); // تأكد من استخدام الـ ID الصحيح للـ Canvas
        if (!canvas) {
            console.error('Canvas not found.');
            resolve(); // يمكنك استخدام reject() هنا إذا كنت تريد التعامل مع هذا كخطأ
            return;
        }

        var dataURL = canvas.toDataURL('image/png');

        var requestNumber = document.getElementById('request-number').value.trim();
        if (!requestNumber) {
            alert("يرجى إدخال رقم الطلب.");
            return;
        }

        var a = document.createElement('a');
        a.href = dataURL;
        a.download = `${requestNumber}.png`;
        a.click();
        resolve();
    });
}

// Function to End Drawing Mode
function endDrawing() {
    const endDrawingButton = document.getElementById('endDrawingButton');

    if (confirm('هل أنت متأكد من إنهاء الرسم؟')) {
        canvas.isDrawingMode = false;
        isDrawing = false;
        finalizePolygon().then(() => {
            endDrawingButton.disabled = true;
        });
    }
}

// Clear Canvas Function
function clearCanvas() {
    canvas.getObjects().forEach(obj => {
        if (obj.id !== 'northArrow') {
            canvas.remove(obj);
        }
    });
    canvas.renderAll();
}

// Add Point Function for Drawing Shapes
function addPoint(event) {
    if (!isDrawing) return;
    var pointer = canvas.getPointer(event.e);
    points.push({ x: pointer.x, y: pointer.y });
    if (points.length > 1) {
        drawPolygon(event);
    }
}

// Draw Polygon Function
function drawPolygon(event) {
    if (!isDrawing || points.length < 2) return;

    var existingPolygons = canvas.getObjects().filter(obj => obj.type === 'polygon');
    existingPolygons.forEach(polygon => canvas.remove(polygon));

    var polygon = new fabric.Polygon(points, {
        stroke: 'black',
        fill: 'rgba(0, 0, 0, 0.1)',
        strokeWidth: 2,
        selectable: false,
        evented: false
    });
    canvas.add(polygon);
}

// Finalize Polygon Function
function finalizePolygon() {
    return new Promise((resolve) => {
        if (points.length > 2) {
            var polygon = new fabric.Polygon(points, {
                stroke: 'black',
                fill: 'rgba(0, 0, 0, 0.1)',
                strokeWidth: 2,
            });
            canvas.add(polygon);
            points = [];
            alert('تم إنهاء الرسم بنجاح!');
        }
    });
}

// Function to Clear Specific Object (Delete Selected Object)
function deleteSelectedObject() {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.id !== 'northArrow') {
        canvas.remove(activeObject);
    }
}

// Attach event listeners to buttons
document.addEventListener('DOMContentLoaded', function () {
    const deleteButton = document.getElementById('deleteObjectButton');
    if (deleteButton) {
        deleteButton.addEventListener('click', deleteSelectedObject);
    }

    const clearButton = document.getElementById('clearCanvasButton');
    if (clearButton) {
        clearButton.addEventListener('click', clearCanvas);
    }
});

// Allow objects to be selectable
canvas.on('object:selected', function (e) {
    console.log('Object selected:', e.target);
});

canvas.on('selection:cleared', function () {
    console.log('Selection cleared');
});

// Function to save form data
function saveFormData() {
    const getElementValue = (selector) => {
        const element = document.querySelector(selector);
        return element ? element.value : '';
    };

    const getFieldValue = (name) => {
        const elements = document.querySelectorAll(`input[name="${name}"]`);
        for (const element of elements) {
            if (element.value) {
                return element.value;
            }
        }
        return '';
    };

    const formData = {
        requestNumber: getElementValue('#request-number'),
        requestid: getElementValue('#requestid'),
        requesterName: getElementValue('#requester-name'),
        applicantName: getElementValue('#applicant-name'),
        sector: getElementValue('#sector'),
        ssec: getElementValue('#ssec'),
        secText: getElementValue('#secText'),
        ssecText: getElementValue('#ssecText'),
        parcelNumber: getFieldValue('parcel-number'),  // جمع القيم من كلا المجموعتين
        plotNumber: getFieldValue('plot-number'),      // جمع القيم من كلا المجموعتين
        planNumber: getFieldValue('plan-number'),      // جمع القيم من كلا المجموعتين
        northBorder: getElementValue('#north_border'),
        northBorderLength: getElementValue('#north_border-length'),
        southBorder: getElementValue('#south_border'),
        southBorderLength: getElementValue('#south_border-length'),
        eastBorder: getElementValue('#east_border'),
        eastBorderLength: getElementValue('#east_border-length'),
        westBorder: getElementValue('#west_border'),
        westBorderLength: getElementValue('#west_border-length'),
        latitude: getElementValue('#latitude'),
        longitude: getElementValue('#longitude'),
        address: getElementValue('#address'),
        areaRequest: getElementValue('#area_request'),
        areaSurvey: getElementValue('#area_survey'),
        description: getElementValue('#description'),
        usageBuilding: getElementValue('#usage_building'),
        surveyorName: getElementValue('input[name="surveyor-name"]'),
        iqrarName: getElementValue('input[name="iqrar_name"]'),
        surveyTeamId: getElementValue('input[name="company-code"]'),
        date: getElementValue('input[name="date"]'),
        evaluation: getElementValue('input[name="evaluation"]:checked'),
        descriptionNearestSign: getElementValue('#description_nearest_sign'),
        detailed_address: getElementValue('#detailed_address'),
        floor_number: getElementValue('#floor_number'),
        floor_number_text: getElementValue('#floor_number_text'),
        survey_apartment_number: getElementValue('#survey_apartment_number'),
        actual_apartment_number: getElementValue('#actual_apartment_number'),
        survey_type: getElementValue('#survey_type'),
    };

    // حفظ البيانات في التخزين المحلي
    localStorage.setItem('formData', JSON.stringify(formData));
    // console.log('تم حفظ البيانات في التخزين المحلي!');
}


// Modified sendData() to include Blob in request body
function sendData() {
    return new Promise((resolve, reject) => {
        saveFormData();

        const storedData = localStorage.getItem('formData');
        if (!storedData) {
            // console.error('لا توجد بيانات في localStorage');
            reject('لا توجد بيانات في localStorage');
            return;
        }

        const formData = JSON.parse(storedData);
        // console.log('بيانات النموذج من localStorage:', formData);

        // الحصول على التوكن من localStorage
        const token = localStorage.getItem('token'); // استبدل 'authToken' باسم المفتاح الذي خزنت فيه التوكن

        if (navigator.onLine) {
            fetch('https://guid-report-new-v5.vercel.app/api/saveData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // أضف التوكن إلى رؤوس الطلب
                },
                body: JSON.stringify(formData)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('نجاح:', data);

                    localStorage.setItem('dataSent', 'true');
                    localStorage.removeItem('formData');

                    if (!window.alertDisplayed) {
                        alert('تم إرسال البيانات بنجاح!');
                        window.alertDisplayed = true;
                    }

                    resetForm();
                    resolve(); // Resolve promise on success
                })
                .catch((error) => {
                    console.error('خطأ:', error);
                    reject(error); // Reject promise on error
                });
        } else {
            alert('لا يوجد اتصال بالإنترنت. سيتم تخزين البيانات وإرسالها لاحقاً.');
            reject('لا يوجد اتصال بالإنترنت');
        }
    });
}



// Function to clear the form after successful submission
function resetForm() {
    const clearInput = (id) => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    };
    clearInput('request-number');
    clearInput('requestid');
    clearInput('requester-name');
    clearInput('sector');
    clearInput('ssec');
    clearInput('secText');
    clearInput('ssecText');
    clearInput('parcel-number');
    clearInput('plot-number');
    clearInput('plan-number');
    clearInput('north_border');
    clearInput('north_border-length');
    clearInput('south_border');
    clearInput('south_border-length');
    clearInput('east_border');
    clearInput('east_border-length');
    clearInput('west_border');
    clearInput('west_border-length');
    clearInput('latitude');
    clearInput('longitude');
    clearInput('address');
    clearInput('area_request');
    clearInput('area_survey');
    clearInput('description');
    clearInput('usage_building');
    clearInput('description_nearest_sign');
    clearInput('detailed_address');
    clearInput('floor_number');
    clearInput('floor_number_text');
    clearInput('survey_apartment_number');
    clearInput('actual_apartment_number');
    clearInput('survey_type');
    clearInput('applicant-name');

    // Clear additional fields
    const clearQueryInput = (selector) => {
        const el = document.querySelector(selector);
        if (el) el.value = '';
    };
    clearQueryInput('input[name="surveyor-name"]');
    clearQueryInput('input[name="company-code"]');
    clearQueryInput('input[name="iqrar_name"]');
    clearQueryInput('input[name="date"]');

    // Reset evaluation radio button
    const checkedEvaluation = document.querySelector('input[name="evaluation"]:checked');
    if (checkedEvaluation) {
        checkedEvaluation.checked = false;
    }

    // Reset window.alertDisplayed flag
    window.alertDisplayed = false;

    if (signaturePadApplicant) {
        signaturePadApplicant.clear();
    }
    if (signaturePadSurveyor) {
        signaturePadSurveyor.clear();
    }
    // Clear canvas
    clearCanvas();
}

// Function to check internet connectivity and send pending data
function checkConnectivity() {
    if (navigator.onLine) {
        if (localStorage.getItem('dataSent') !== 'true' && localStorage.getItem('formData')) {
            sendData();
        }
    }
}

// Open camera
const openCameraPopupButton = document.getElementById('openCameraPopup');

if (openCameraPopupButton) {
    openCameraPopupButton.addEventListener('click', function (event) {
        event.preventDefault(); 

        const requestNumber = document.getElementById('request-number').value.trim();
        if (!requestNumber) {
            alert("يرجى إدخال رقم الطلب.");
            return false;
        }

        const popupWidth = 620;
        const popupHeight = 440;
        const left = (window.screen.width / 2) - (popupWidth / 2);
        const top = (window.screen.height / 2) - (popupHeight / 2);

        window.open(
            `camera.html?requestNumber=${encodeURIComponent(requestNumber)}`,
            '_blank',
            `width=${popupWidth},height=${popupHeight},left=${left},top=${top}`
        );
    });
}

// Add event listener for connectivity changes
window.addEventListener('online', checkConnectivity);
window.addEventListener('offline', checkConnectivity);

// Get Geolocation
document.addEventListener('DOMContentLoaded', (event) => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("خطأ في تحديد الموقع");
    }
});

function showPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    document.getElementById('latitude').value = latitude;
    document.getElementById('longitude').value = longitude;

    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=ar`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('address').value = data.display_name;
        })
        .catch(error => console.error('Error:', error));
}

// Handling form submission and data sending
document.addEventListener('DOMContentLoaded', function () {
    const sendButton = document.getElementById('send-data');
    if (sendButton) {
        sendButton.addEventListener('click', function (event) {
            event.preventDefault(); 
            exportCanvasImage().then(() => {
                return sendData();
            }).then(() => {
                window.location.href = 'guidnesList.html';
            }).catch((error) => {
                console.error('Error:', error);
            });
        });
    }
});

//signature-pad
document.addEventListener('DOMContentLoaded', function () {
    // الحصول على العناصر
    var applicantCanvas = document.getElementById('signature-pad-applicant');
    var surveyorCanvas = document.getElementById('signature-pad-surveyor');
    var confirmSignatureApplicantButton = document.getElementById('confirm-signature-applicant');
    var confirmSignatureSurveyorButton = document.getElementById('confirm-signature-surveyor');
    var sendDataButton = document.getElementById('send-data');
    // التحقق من وجود العناصر
    if (applicantCanvas && surveyorCanvas && confirmSignatureApplicantButton && confirmSignatureSurveyorButton && sendDataButton) {
        // إعدادات مشتركة للتوقيعين
        var sharedOptions = {
            penColor: '#333',
            backgroundColor: 'rgba(255, 255, 255, 0.5)', 

        };

        var signaturePadApplicant = new SignaturePad(applicantCanvas, sharedOptions);
        var signaturePadSurveyor = new SignaturePad(surveyorCanvas, sharedOptions);

        var isApplicantSignatureConfirmed = false;
        var isSurveyorSignatureConfirmed = false;

        window.clearSignature = function (type) {
            if (type === 'applicant' && !isApplicantSignatureConfirmed) {
                signaturePadApplicant.clear();
            } else if (type === 'surveyor' && !isSurveyorSignatureConfirmed) {
                signaturePadSurveyor.clear();
            }
        };

        confirmSignatureApplicantButton.addEventListener('click', function () {
            if (!isApplicantSignatureConfirmed && !signaturePadApplicant.isEmpty()) {
                var confirmResult = confirm('هل أنت متأكد من التوقيع؟');
                if (confirmResult) {
                    isApplicantSignatureConfirmed = true;
                    disableSignaturePad(signaturePadApplicant);
                    alert('تم تأكيد توقيع مقدم الطلب.');
                }
            } else {
                alert('الرجاء تقديم توقيع أولاً.');
            }
        });

        confirmSignatureSurveyorButton.addEventListener('click', function () {
            if (!isSurveyorSignatureConfirmed && !signaturePadSurveyor.isEmpty()) {
                var confirmResult = confirm('هل أنت متأكد من التوقيع؟');
                if (confirmResult) {
                    isSurveyorSignatureConfirmed = true;
                    disableSignaturePad(signaturePadSurveyor);
                    alert('تم تأكيد توقيع القائم بالرفع.');
                }
            } else {
                alert('الرجاء تقديم توقيع أولاً.');
            }
        });

        sendDataButton.addEventListener('click', function () {
            if (isApplicantSignatureConfirmed && isSurveyorSignatureConfirmed) {
                // احصل على رقم الطلب
                var requestNumber = document.getElementById('request-number').value.trim();

                if (!requestNumber) {
                    alert('يرجى إدخال رقم الطلب.');
                    return;
                }

                // تحويل التوقيعات إلى صور
                var applicantDataURL = signaturePadApplicant.toDataURL();
                var surveyorDataURL = signaturePadSurveyor.toDataURL();

                // تحميل التوقيعات كصور باستخدام رقم الطلب
                downloadImage(applicantDataURL, `${requestNumber}_applicant_signature.png`);
                downloadImage(surveyorDataURL, `${requestNumber}_surveyor_signature.png`);

                // إرسال البيانات عبر AJAX أو أي طريقة أخرى (تم الإشارة إلى ذلك كملاحظة في الشيفرة)

                // تنظيف النموذج
                document.getElementById('fileUploadForm').reset();
                signaturePadApplicant.clear();
                signaturePadSurveyor.clear();
                // تنظيف محتوى Canvas أو أي عنصر آخر إذا كان ضروريًا
                clearCanvas(); // تأكد من أن لديك دالة clearCanvas() لتعريف كيفية تنظيف Canvas الخاص بك

                // إعادة تفعيل لوحات التوقيع لإعادة الاستخدام
                enableSignaturePad(signaturePadApplicant);
                enableSignaturePad(signaturePadSurveyor);
                isApplicantSignatureConfirmed = false;
                isSurveyorSignatureConfirmed = false;
            } else {
                alert('يرجى تأكيد جميع التوقيعات قبل إرسال البيانات.');
            }
        });



        // Function to download image
        function downloadImage(dataURL, filename) {
            var a = document.createElement('a');
            a.href = dataURL;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }

        // Add event listener for sending data with images
        document.addEventListener('DOMContentLoaded', function () {
            const sendDataButton = document.getElementById('send-data');
            if (sendDataButton) {
                sendDataButton.addEventListener('click', function (event) {
                    event.preventDefault(); // Prevent default page reload
                    sendDataWithImages(); // Call function to send data with images
                });
            }
        });

        // Ensure data sending when connectivity is restored
        window.addEventListener('online', checkConnectivity);
        window.addEventListener('offline', checkConnectivity);

        function disableSignaturePad(signaturePad) {
            if (signaturePad && signaturePad._canvas) {
                signaturePad.off();
                signaturePad._canvas.style.pointerEvents = 'none';
            } else {
                console.error('signaturePad أو _canvas غير معرف.');
            }
        }

        function enableSignaturePad(signaturePad) {
            if (signaturePad && signaturePad._canvas) {
                signaturePad.on();
                signaturePad._canvas.style.pointerEvents = 'auto';
            } else {
                console.error('signaturePad أو _canvas غير معرف.');
            }
        }
    } else {
        console.error('عنصر واحد أو أكثر غير موجود في DOM.');
    }
});

// function for hiddening survey_type
document.addEventListener("DOMContentLoaded", function () {
    const surveyType = document.getElementById("survey_type");
    const buildingFields = document.getElementById("building-fields");
    const apartmentFields = document.getElementById("apartment-fields");
    const landFields = document.getElementById("land-fields");

    function handleSurveyTypeChange() {
        const value = surveyType.value;

        // Hide all fields initially
        buildingFields.style.display = "none";
        apartmentFields.style.display = "none";
        landFields.style.display = "none";

        // Show relevant fields based on selected survey type
        // 0==>وحده
        // 10==>وحدة دوبلكس
        // 4==>جراج
        // 18==>وحدة تربلكس
        // 19==>وحدة كوادريبلكس
        // 24==>وحدة بحديقة
        if (value === "0" || value === "10" || value === "4" || value === "18" || value === "19" || value === "24") {
            apartmentFields.style.display = "block";
            // 3==>مبني
            // 5==>مبني بحديقة
            // 4==>(وده عشان يتعامل مع جميع المدخلات الموجوده في الوحدة والمبني )جراج 
            // 15==>فيلا
            // 13==>شالية
        } else if (value === "3" || value === "4" || value === "5" || value === "15" || value === "13") {
            buildingFields.style.display = "block";
            // 1==>ارض مقاسة بالمتر
            // 2==>ارض مقاسة بالفدان

        } else if (value === "1" || value === "2") {
            landFields.style.display = "block";
        } else {
            // إذا لم يكن هناك تطابق مع أي من القيم
            apartmentFields.style.display = "none";
            buildingFields.style.display = "none";
            landFields.style.display = "none";
        }
    }

    // Initial call to set visibility based on default value
    handleSurveyTypeChange();

    // Add event listener to handle changes
    surveyType.addEventListener("change", handleSurveyTypeChange);
});
// الحصول على عنصري القائمتين
const surveyTypeSelect = document.getElementById('survey_type');
const usageSelect = document.getElementById('usage');

// إضافة حدث 'change' للقائمة 'survey_type'
surveyTypeSelect.addEventListener('change', function () {
    const selectedValue = surveyTypeSelect.value; // الحصول على القيمة المختارة

    // تعيين القيمة في قائمة 'usage'
    usageSelect.value = selectedValue;
});


// تعيين التاريخ بشكل automatic
function formatDateToYMD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function setCurrentDate() {
    const today = new Date();
    const formattedDate = formatDateToYMD(today);
    document.getElementById('date-input').value = formattedDate;
}

// Call the function to set the current date on page load
setCurrentDate();
