// 创建按钮元素
var button = document.createElement("button");
button.innerHTML = "剪贴板";

// 添加样式
button.style.backgroundColor = "#ff6600";
button.style.color = "white";
button.style.maxWidth = "5em";
button.style.height = "3em";
button.style.borderRadius = "0.2em";
button.style.fontSize="bold";

// 添加点击事件处理程序
button.addEventListener("click", function() {
    // 请求用户授权访问剪贴板内容
    navigator.clipboard.readText()
        .then(function(clipboardData) {
            input = clipboardData;
            const content = input.substring(0, input.indexOf('Negative prompt:'));
            const negativePrompt = input.substring(input.indexOf('Negative prompt:') + 16, input.indexOf('Steps:')).trim();
            const steps = parseInt(input.match(/Steps: (\d+)/)?.[1]);
            const seed = parseInt(input.match(/Seed: (\d+)/)?.[1]);
            const sampler = input.match(/Sampler: ([^,]+)/)?.[1];
            const cfgScale = parseInt(input.match(/CFG scale: (\d+)/)?.[1]);
            const model = input.match(/Model: ([^,]+)/)?.[1];
            let width = parseInt(input.match(/width: (\d+)/)?.[1]);
            let height = parseInt(input.match(/height: (\d+)/)?.[1]);
            if (isNaN(width) || isNaN(height)) {
                // Size: 1304x1304
                const size = input.match(/Size: (\d+)x(\d+)/);
                width = parseInt(size?.[1]);
                height = parseInt(size?.[2]);
            }

            const output = {
                content: content.trim(),
                negativePrompt: negativePrompt,
                Steps: steps,
                Seed: seed,
                Sampler: sampler,
                CFGscale: cfgScale,
                model: model,
                width: width,
                height: height
            };

            console.log(JSON.stringify(output, null, 2));

            // 通过剪贴板赋值
           document.getElementById('txt2img_prompt').querySelector('textarea').value = output.content;
           document.getElementById('txt2img_neg_prompt').querySelector('textarea').value = output.negativePrompt;
            document.getElementById('txt2img_sampling').querySelector('input').value = output.Sampler;
           document.getElementById('txt2img_steps').querySelector('input').value = output.Steps;
           document.getElementById('txt2img_width').querySelector('input').value = output.width;
           document.getElementById('txt2img_height').querySelector('input').value = output.height;
           document.getElementById('txt2img_cfg_scale').querySelector('input').value = output.CFGscale;
           document.getElementById('txt2img_seed').querySelector('input').value = output.Seed;




        })
        // .catch(function(error) {
        //     console.error("获取剪贴板内容失败: " + error);
        // });
});

// document.addEventListener("DOMContentLoaded", function() {
//
// // 将按钮插入到页面中
// // document.body.appendChild(button);
//     document.getElementById("quicksettings").appendChild(button);
// });
// 注册事件监听器

// window.onload = function() {
//     // 在所有资源加载完成后执行的代码
//     console.log("onload");
//     document.getElementById("quicksettings").appendChild(button);
// };

// const ce = document.getElementsByTagName("gradio-app");
// if (ce[0]) {
//     ce[0].addEventListener("domchange", () => {
//         console.log("domchange");
//         document.getElementById("quicksettings").appendChild(button);
//     });
// }

const targetNode = document.getElementsByTagName("gradio-app")[0];

const observer = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // 遍历每个被添加的节点
            for (let node of mutation.addedNodes) {
               if (node.id !== null && node.id === "quicksettings") {
                   node.appendChild(button);
                   observer.disconnect();
               }
            }
        }
    }
});

const config = { childList: true, subtree: true };
observer.observe(targetNode, config);


